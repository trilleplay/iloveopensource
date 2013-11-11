/**
 * Author: krasu
 * Date: 9/17/13
 * Time: 1:46 PM
 */
define(function (require) {
	require('backbone')

	var store = require('store').getNamespace('maintainer')
	var updater = require('plugins/project.updater')
	var tpl = require('tpl!../templates/list.html')
	var helpTpl = require('tpl!../templates/help.html')
	var Group = require('./group')

	return Backbone.View.extend({
		events: {
			'click .update-projects-info': 'updateProjects',
			'click .show-help': 'showHelp',
			'click .hide-help': 'hideHelp'
		},
		initialize: function () {
			this.groups = []
			this.collection = store().projects
			this.listenTo(store().projects, 'sync', this.showProjects)
			this.listenTo(store().projects, 'request', this.showLoading)
            updater.on('done', _.bind(function () {
                store().projects.fetch()
            }, this))
		},
		showHelp: function() {
			this.$('.content-holder').hide()
			this.$('.help.layout').show()
		},
		hideHelp: function() {
			this.$('.content-holder').show()
			this.$('.help.layout').hide()
		},
		showProjects: function () {
			this.$('.loading').hide()
			this.$('.content').slideDown()
			this.render()
		},
		showLoading: function () {
			this.$('.loading').show()
			this.$('.content').slideUp()
		},
		renderGroups: function () {
			var list = this.$('.repos-list')
			_.invoke(this.groups, 'remove')
			this.groups = []

			if (!this.collection.length) return

			this.collection.each(function (repo) {
				var view = new Group({model: repo})
				this.groups.push(view)
				view.render()
			}, this)

			list.removeClass('hidden').append(_.pluck(this.groups, 'el'))
		},
		render: function () {
			this.$('.content').html(tpl())
			this.$('.help.layout').html(helpTpl())
			this.renderGroups()
			this.checkIsEmpty()
			return this
		},
		checkIsEmpty: function () {
			var el = this.$('.is-empty.message')

			if (this.collection.length) {
				el.addClass('hidden')
			} else {
				el.removeClass('hidden')
			}
		}
	});
})