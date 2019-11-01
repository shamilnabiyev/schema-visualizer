export const jsonDocValidator = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "anyOf": [
        {"$ref": "#/definitions/object_typ"},
        {"$ref": "#/definitions/array_type"}
    ],
    "definitions": {
        "object_typ": {
            "type": "object",
            "minProperties": 1
        },
        "array_type": {
            "type": "array",
            "items": {"$ref": "#/definitions/object_typ"},
            "minItems": 1
        }
    }
};

export const jsonSchemaValidator = {
    "title": "JSON-Schema-Validator",
    "description": "Validiert das von Benutzer eingegebebes JSON-Schema",
    "type": "object",
    "properties": {
        "title": {
            "type": "string"
        },
        "properties": {
            "type": "object",
            "minProperties": 1,
            "additionalProperties": {
                "anyOf": [
                    {"$ref": "#/definitions/primitive_types"},
                    {"$ref": "#/definitions/array_type"},
                    {"$ref": "#/definitions/object_type"}
                ]
            }
        }
    },
    "required": ["properties"],
    "definitions": {
        "primitive_types": {
            "type": "object",
            "description": "Validiert primitive Datentypen, wie string, number und boolean",
            "properties": {
                "type": {"type": "string"},
            },
            "required": ["type"],
            "additionalProperties": true
        },
        "array_type": {
            "type": "object",
            "properties": {
                "type": {"type": "string"},
                "items": {
                    "anyOf": [
                        {"$ref": "#/definitions/primitive_types"},
                        {"$ref": "#/definitions/items"}
                    ]
                }
            },
            "required": ["type", "items"],
            "additionalProperties": true
        },
        "object_type": {
            "type": "object",
            "properties": {
                "type": {"type": "string"},
                "properties": {
                    "type": "object",
                    "additionalProperties": {
                        "anyOf": [
                            {"$ref": "#/definitions/primitive_types"},
                            {"$ref": "#/definitions/object_type"},
                            {"$ref": "#/definitions/array_type"}
                        ]
                    }
                }
            },
            "required": ["type", "properties"]
        },
        "items": {
            "type": "array",
            "items": {
                "anyOf": [
                    {"$ref": "#/definitions/primitive_types"},
                    {"$ref": "#/definitions/object_type"},
                    {"$ref": "#/definitions/array_type"}
                ]
            }
        }
    }
};