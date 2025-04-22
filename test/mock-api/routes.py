from flask import Blueprint, jsonify, request, Response
from flask_cors import cross_origin

routes = Blueprint("routes", __name__, url_prefix="/api")

@routes.route("/from-blank", methods=['POST'])
@cross_origin()
def create_from_blank():
    entities = request.form.get("entities")
    print(f"Creating from blank with entities: {entities}")
    
    ret = {
        "layout": "blank-id"
    }

    resp = jsonify(ret)
    resp.status = 201

    return resp

@routes.route("/from-ai", methods=['POST'])
@cross_origin()
def create_from_ai():
    ret = {
        "layout": "ai-id"
    }

    resp = jsonify(ret)
    resp.status = 201

    return resp

@routes.route("/all-entities", methods=['GET'])
@cross_origin()
def get_all_entities():
    entities = {
            "acc01": { "name": "Account 1", "types": ["Return", "Market Value", "Allocation"] },
            "acc02": { "name": "Account 2", "types": ["Return", "Market Value", "Allocation"] },
            "acc04": { "name": "Account 4", "types": ["Return", "Market Value", "Allocation"] },
            "acc05": { "name": "Account 5", "types": ["Return", "Market Value", "Allocation"] },
            "acc06": { "name": "Account 6", "types": ["Return", "Market Value", "Allocation"] },
            "acc07": { "name": "Account 7", "types": ["Return", "Market Value", "Allocation"] },
            "acc08": { "name": "Account 8", "types": ["Return", "Market Value", "Allocation"] },
            "acc09": { "name": "Account 9", "types": ["Return", "Market Value", "Allocation"] },
            "pos01": { "name": "Position 1", "types": ["Market Value", "Return"], "parent": "acc01" },
            "pos02": { "name": "Position 2", "types": ["Market Value", "Return"], "parent": "acc01" },
            "pos03": { "name": "Position 3", "types": ["Market Value", "Return"], "parent": "acc02" },
            "pos04": { "name": "Position 4", "types": ["Market Value", "Return"], "parent": "acc07" },
            "pos05": { "name": "Position 5", "types": ["Market Value", "Return"], "parent": "acc09" }
    }
    resp = jsonify(entities)
    resp.status = 200
    return resp