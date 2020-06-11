// Travel Controllers File.
const axios = require("axios");


// GET location.
exports.location = async function(req, res, next) {
    try {
        let response = await axios({
			method: "GET",
			url: "https://www.triposo.com/api/20200405/location.json", // (20200405/latest)
			headers: {
				"X-Triposo-Account": process.env.TRIPOSO_ACCOUNT_ID,
				"X-Triposo-Token": process.env.TRIPOSO_API_TOKEN
            },
            params: {
                "annotate": `trigram:${req.query.id}`,
                "count": "1",
                "fields": "id,name,coordinates,content", // all
                "order_by": "-trigram"
            }
		});
		res.status(200).json(response.data);
    } catch (error) {
        res.status(422).json("Oops, an error occurred. Please try again.");
    }
}

// GET Find the top places in a location.
exports.poiInLocation = async function(req, res, next) {
    try {
        let response = await axios({
			method: "GET",
			url: "https://www.triposo.com/api/20200405/poi.json",
			headers: {
				"X-Triposo-Account": process.env.TRIPOSO_ACCOUNT_ID,
				"X-Triposo-Token": process.env.TRIPOSO_API_TOKEN
            },
            params: {
                "location_id": req.query.id,
                "tag_labels": req.query.tag, // (/api/20200405/common_tag_labels.json)
                "count": "10",
                "offset": req.query.offset,
                "fields": "id,name,coordinates,intro,images",
                "order_by": "-score"
            }
		});
		res.status(200).json(response.data);
    } catch (error) {
        res.status(422).json("Oops, an error occurred. Please try again.");
    }
}

// GET Find places near given coordinates.
exports.poiInCoordinates = async function(req, res, next) {
    try {
        let response = await axios({
			method: "GET",
			url: "https://www.triposo.com/api/20200405/poi.json",
			headers: {
				"X-Triposo-Account": process.env.TRIPOSO_ACCOUNT_ID,
				"X-Triposo-Token": process.env.TRIPOSO_API_TOKEN
            },
            params: {
                "annotate": `distance:${req.query.lat},${req.query.lng}`,
                "tag_labels": req.query.tag,
                "distance": "<1000",
                "count": "10",
                "offset": req.query.offset,
                "fields": "id,name,coordinates,intro,images",
                "order_by": "-score"
            }
		});
		res.status(200).json(response.data);
    } catch (error) {
        res.status(422).json("Oops, an error occurred. Please try again.");
    }
}
