# Copyright (c) 2026, Keytech and contributors
# For license information, please see license.txt

import frappe
from frappe import _


@frappe.whitelist()
def get_sidebar_menu():
	"""Return Sidebar Menu items for the custom desk sidebar."""
	items = frappe.get_all(
		"Sidebar Menu",
		filters={"is_visible": 1},
		fields=[
			"name",
			"menu_label",
			"icon",
			"action",
			"route_or_link",
			"parent_sidebar_menu",
			"is_group",
			"sort_order",
			"badge",
		],
		order_by="lft asc",
	)

	for item in items:
		if item.get("action") == "Link" and item.get("route_or_link"):
			doctype = item["route_or_link"]
			try:
				if frappe.db.exists("DocType", doctype):
					item["badge"] = frappe.db.count(doctype)
				else:
					item["badge"] = None
			except Exception:
				item["badge"] = None

	return items


def setup_test_data():
	"""Create test sidebar menu items for development."""
	items = [
		{"menu_label": "Home", "action": "Route", "route_or_link": "/app", "is_group": 1, "is_visible": 1, "sort_order": 0, "icon": "octicon octicon-home"},
		{"menu_label": "Workspace", "action": "Route", "route_or_link": "/app/workspace", "is_group": 0, "is_visible": 1, "sort_order": 1, "icon": "octicon octicon-graph", "parent_sidebar_menu": "Home"},
		{"menu_label": "Setup", "action": "Route", "route_or_link": "#", "is_group": 1, "is_visible": 1, "sort_order": 10, "icon": "octicon octicon-gear", "parent_sidebar_menu": "Home"},
		{"menu_label": "Users", "action": "Route", "route_or_link": "/app/user", "is_group": 0, "is_visible": 1, "sort_order": 1, "parent_sidebar_menu": "Setup", "icon": "octicon octicon-person"},
		{"menu_label": "Settings", "action": "Route", "route_or_link": "/app/settings", "is_group": 0, "is_visible": 1, "sort_order": 2, "parent_sidebar_menu": "Setup", "icon": "octicon octicon-tools"},
	]

	for item_data in items:
		if frappe.db.exists("Sidebar Menu", item_data["menu_label"]):
			print(f"Skipped (exists): {item_data['menu_label']}")
			continue
		doc = frappe.new_doc("Sidebar Menu")
		doc.update(item_data)
		doc.insert(ignore_permissions=True)
		print(f"Created: {doc.name}")

	frappe.db.commit()
	print("Done!")
