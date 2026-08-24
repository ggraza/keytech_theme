app_name = "bigtech_theme"
app_title = "Bigtech Theme"
app_publisher = "Keytech"
app_description = "Theme v15"
app_email = "info@keytech.co.id"
app_license = "mit"

# Apps
# ------------------

# required_apps = []

# Each item in the list will be shown as an app in the apps page
# add_to_apps_screen = [
# 	{
# 		"name": "bigtech_theme",
# 		"logo": "/assets/bigtech_theme/logo.png",
# 		"title": "Bigtech Theme",
# 		"route": "/bigtech_theme",
# 		"has_permission": "bigtech_theme.api.permission.has_app_permission"
# 	}
# ]

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
app_include_css = "/assets/bigtech_theme/css/bigtech_theme.css?v=15"
app_include_js = "/assets/bigtech_theme/js/bigtech_theme.js?v=9"

# include js, css files in header of web template
# web_include_css = "/assets/bigtech_theme/css/bigtech_theme.css"
# web_include_js = "/assets/bigtech_theme/js/bigtech_theme.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "bigtech_theme/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Svg Icons
# ------------------
# include app icons in desk
# app_include_icons = "bigtech_theme/public/icons.svg"

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
# 	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "bigtech_theme.utils.jinja_methods",
# 	"filters": "bigtech_theme.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "bigtech_theme.install.before_install"
# after_install = "bigtech_theme.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "bigtech_theme.uninstall.before_uninstall"
# after_uninstall = "bigtech_theme.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "bigtech_theme.utils.before_app_install"
# after_app_install = "bigtech_theme.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "bigtech_theme.utils.before_app_uninstall"
# after_app_uninstall = "bigtech_theme.utils.after_app_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "bigtech_theme.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

doc_events = {
	"Sidebar Menu": {
		"on_update": "bigtech_theme.api.trigger_sidebar_menu_refresh",
		"on_trash": "bigtech_theme.api.trigger_sidebar_menu_refresh",
	}
}

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"bigtech_theme.tasks.all"
# 	],
# 	"daily": [
# 		"bigtech_theme.tasks.daily"
# 	],
# 	"hourly": [
# 		"bigtech_theme.tasks.hourly"
# 	],
# 	"weekly": [
# 		"bigtech_theme.tasks.weekly"
# 	],
# 	"monthly": [
# 		"bigtech_theme.tasks.monthly"
# 	],
# }

# Testing
# -------

# before_tests = "bigtech_theme.install.before_tests"

# Overriding Methods
# ------------------------------
# Note: We intentionally do NOT override frappe.desk.desktop.get_workspace_sidebar_items.
# We keep Frappe's default workspace routing intact and render a fully custom
# desk sidebar (#kt-sidebar) driven by bigtech_theme.api.get_sidebar_menu.
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "bigtech_theme.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["bigtech_theme.utils.before_request"]
# after_request = ["bigtech_theme.utils.after_request"]

# Job Events
# ----------
# before_job = ["bigtech_theme.utils.before_job"]
# after_job = ["bigtech_theme.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"bigtech_theme.auth.validate"
# ]

# Automatically update python controller files with type annotations for this app.
# export_python_type_annotations = True

# default_log_clearing_doctypes = {
# 	"Logging DocType Name": 30  # days to retain logs
# }

# Translation
# ------------
# List of apps whose translatable strings should be excluded from this app's translations.
# ignore_translatable_strings_from = []

