from flask import Blueprint, jsonify, request, Response
from flask_cors import cross_origin

routes = Blueprint("routes", __name__, url_prefix="/api")

layouts: dict[str, dict[str, str]] = {}
CONST_ENTITIES = {
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

@routes.route("/from-blank", methods=['POST'])
@cross_origin()
def create_from_blank():
    req = request.json

    layouts['blank-id'] = req
    
    ret = {
        "layout": "blank-id"
    }

    resp = jsonify(ret)
    resp.status = 201

    return resp

@routes.route("/from-ai", methods=['POST'])
@cross_origin()
def create_from_ai():
    req = request.json
    req['name'] = 'AI Name ehehe'

    layouts['ai-id'] = req

    ret = {
        "layout": "ai-id"
    }

    resp = jsonify(ret)
    resp.status = 201

    return resp

@routes.route("/doc", methods=['GET'])
@cross_origin()
def get_doc():
    req = request.args
    print(layouts)
    layout = req["layout"]
    print(f"Getting layout: '{layout}'")

    if (layout not in layouts.keys()):
        resp = jsonify({"ERROR": "Invalid layout id"})
        resp.status = 400
        return resp

    entities = {}
    for entity in layouts[layout]["entities"]:
        print(f"Getting entity: '{entity}'")
        entities[entity] = CONST_ENTITIES[entity]

    data_types = {
        "Market Value": { "types": ["line", "multi-line", "bar", "table"], "range2-enabled": "true", "can-be-multiple": "true" },
        "Return": { "types": ["line", "multi-line", "bar", "table"], "range2-enabled": "true", "can-be-multiple": "true" },
        "Allocation": { "types": ["pie", "table"], "range2-enabled": "false", "can-be-multiple": "false" }
    }

    resp = jsonify({"entities": entities, "dataTypes": data_types, "name": layouts[layout]["name"]})
    resp.status = 200

    return resp


@routes.route("/all-entities", methods=['GET'])
@cross_origin()
def get_all_entities():
    resp = jsonify(CONST_ENTITIES)
    resp.status = 200
    return resp