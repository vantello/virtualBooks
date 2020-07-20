'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new mongoose.Schema({
	title:String,
	author:String,
	editorial: String,
	read: String,
	pages: Number,
	category: String,
	usuari: String,
	deixat: String,
	who: String,
	llegir: ["Si", "No"],
	comments: String,
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Book', bookSchema);
