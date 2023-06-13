from flask import Flask, jsonify, render_template
from pymongo import MongoClient, errors

app = Flask(__name__)
# @app.route('/images/bluemarker.png')

# def serve_static(filename):
#     root_dir = os.path.dirname(os.path.abspath(__file__))
#     return send_from_directory(os.path.join(root_dir, 'images'), filename)
@app.route('/path:filename')
def serve_static(filename):
    root_dir = os.path.dirname(os.path.abspath(__file__))
    return send_from_directory(os.path.join(root_dir, 'images'), filename)

def get_stream_coordinates(collection):
    stream_coordinates = {}
    cursor = collection.find()
    for doc in cursor:
        stream_name = doc.get('Stream Name')  # Replace 'stream_name_field' with the actual field name
        latitude = float(doc.get('Latitude'))
        longitude = float(doc.get('Longitude'))
        if stream_name:
            stream_coordinates[stream_name] = {'Latitude': latitude, 'Longitude': longitude}
    return stream_coordinates

@app.route('/data', methods=['GET'])
def get_data():
    username = "Michael"
    password = "Ourgrouprocks123"
    cluster = "salmonpopulation.samyjbo.mongodb.net"
    client = MongoClient(f"mongodb+srv://{username}:{password}@{cluster}/")

    try:
        client.server_info()
        print("Connected to MongoDB Server")
    except errors.ServerSelectionTimeoutError as err:
        print("Could not connect to MongoDB Server:", err)
        return "Could not connect to MongoDB Server", 500

    db = client['SalmonPopulation']
    species_tables = ['Chinook_map_table', 'Chum_map_table', 'Coho_map_table', 'Sockeye_map_table', 'Steelhead_map_table']

    stream_coordinates_collection = db['stream_coordinates']
    stream_coordinates = get_stream_coordinates(stream_coordinates_collection)

    output = {}

    for table in species_tables:
        collection = db[table]
        documents = collection.find()
        table_data = []
        total_documents = collection.count_documents({})
        processed_documents = 0

        for doc in documents:
            doc.pop('_id', None)
            stream_name = doc['Stream Name']
            if stream_name in stream_coordinates:
                doc.update(stream_coordinates[stream_name])

            hatchery_total = doc.get('Hatchery Salmon Total', 0)
            wild_total = doc.get('Wild Salmon Total', 0)
            doc['Total Population'] = hatchery_total + wild_total
            table_data.append(doc)
            processed_documents += 1
            print(f"Processed {processed_documents}/{total_documents} documents in table {table}")

        output[table] = table_data

    return jsonify(output)

@app.route('/chart', methods=['GET'])
def get_chart():
    return render_template('chart.html')

@app.route('/chart-data/<int:year>', methods=['GET'])
def get_chart_data_for_year(year):
    output = get_data()
    if isinstance(output, str):  # Check if get_data() returned an error string
        return jsonify({'error': output}), 500
    output = output.json
    species_populations = {}
    for table, data in output.items():
        species = table.split('_')[0]  # Extract species name from the table name
        data_for_year = [item for item in data if item['Brood Year'] == year]
        hatchery_population = sum(item['Hatchery Salmon Total'] for item in data_for_year)
        wild_population = sum(item['Wild Salmon Total'] for item in data_for_year)
        species_populations[species] = {'hatchery': hatchery_population, 'wild': wild_population}
    return jsonify(species_populations)
@app.route('/map', methods=['GET'])
def get_map():
    return render_template('map.html')
if __name__ == "__main__":
    app.run(debug=True)
    