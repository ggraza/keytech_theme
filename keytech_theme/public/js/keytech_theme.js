// Copyright (c) 2026, Keytech and contributors
// For license information, please see license.txt

frappe.provide("keytech_theme");

keytech_theme = {
	_initialized: false,
	_fetched: false,

	init() {
		if (this._initialized) return;
		this._initialized = true;

		this.init_toggle();

		if (frappe.router) {
			frappe.router.on("change", () => {
				this.set_active();
				this.init_form_sidebar();
			});
		}

		if (frappe.realtime) {
			frappe.realtime.on("keytech_theme:sidebar_updated", () => this.reload_sidebar());
		}

		// app_ready fires synchronously inside Application.startup(); depending on
		// $(document).ready handler order it may fire before this listener is bound.
		if (frappe.app) {
			this.fetch_and_render();
		} else {
			$(document).on("app_ready", () => this.fetch_and_render());
		}
	},

	async fetch_and_render() {
		if (this._fetched) return;
		this._fetched = true;

		try {
			const items = await frappe.xcall("keytech_theme.api.get_sidebar_menu");
			this.render_sidebar(items || []);
		} catch (e) {
			console.error("keytech_theme: failed to load sidebar menu", e);
		}
	},

	async reload_sidebar() {
		if (this._reloading) return;
		this._reloading = true;

		try {
			this._fetched = false;
			await this.fetch_and_render();
		} finally {
			this._reloading = false;
		}
	},

	build_sidebar_container() {
		const $existing = $("#kt-sidebar");
		if ($existing.length) return $existing;

		const $sidebar = $(`
			<aside id="kt-sidebar">
				<button type="button" class="kt-sidebar-toggle" aria-label="Toggle sidebar">
					<i class="octicon octicon-chevron-left"></i>
				</button>
				<div class="kt-sidebar-body">
					<ul class="kt-sidebar-menu"></ul>
				</div>
				<div class="kt-sidebar-footer">
					<div class="kt-sidebar-user"></div>
				</div>
			</aside>
		`);

		$sidebar.find(".kt-sidebar-user").append(frappe.avatar(frappe.session.user, "avatar-medium"));
		$sidebar.find(".kt-sidebar-user").append(
			$("<span>").addClass("kt-sidebar-user-name").text(frappe.user_info().fullname)
		);

		$("body").prepend($sidebar);
		return $sidebar;
	},

	build_tree(items) {
		const children = {};
		items.forEach((item) => {
			const parent = item.parent_sidebar_menu || "";
			(children[parent] = children[parent] || []).push(item);
		});
		return (children[""] || []).map((item) => this.attach_children(item, children));
	},

	attach_children(item, children) {
		item.children = (children[item.name] || []).map((child) =>
			this.attach_children(child, children)
		);
		return item;
	},

	render_sidebar(items) {
		const $sidebar = this.build_sidebar_container();
		const $menu = $sidebar.find(".kt-sidebar-menu").empty();

		const tree = this.build_tree(items);
		tree.forEach((node) => $menu.append(this.render_node(node)));

		this.apply_toggle_state();
		this.set_active();
	},

	render_node(node) {
		const $li = $("<li>")
			.addClass("kt-sidebar-item")
			.attr("data-name", node.name);

		if (node.is_group) {
			$li.addClass("kt-sidebar-group");

			const $link = $("<a>").addClass("kt-sidebar-link").attr("href", "#").attr("data-name", node.name).attr("data-action", "group").attr("data-route", node.route_or_link || "");
			$link.append($("<span>").addClass("kt-sidebar-icon").html(this.icon_html(node.icon)));
			$link.append($("<span>").addClass("kt-sidebar-label").text(node.menu_label || node.name));
			$link.append($("<span>").addClass("kt-sidebar-chevron").html(frappe.utils.icon("right", "xs")));

			const $children = $("<ul>").addClass("kt-sidebar-children");
			(node.children || []).forEach((child) => $children.append(this.render_node(child)));

			$li.append($link, $children);
			return $li;
		}

		const $link = $("<a>")
			.addClass("kt-sidebar-link")
			.attr("href", this.href_for(node))
			.attr("data-name", node.name)
			.attr("data-action", node.action || "Route")
			.attr("data-route", node.route_or_link || "");
		$link.append($("<span>").addClass("kt-sidebar-icon").html(this.icon_html(node.icon)));
		$link.append($("<span>").addClass("kt-sidebar-label").text(node.menu_label || node.name));

		if (node.badge) {
			$link.append($("<span>").addClass("kt-sidebar-badge").text(node.badge));
		}

		$li.append($link);
		return $li;
	},

	icon_html(icon) {
		if (!icon) return frappe.utils.icon("folder-normal", "sm");
		if (icon.startsWith("octicon") || icon.startsWith("fa") || icon.startsWith("es-")) {
			return `<i class="${icon}"></i>`;
		}
		return frappe.utils.icon(icon, "sm");
	},

	href_for(node) {
		const route = node.route_or_link || "";
		if (node.action === "Link") return "/app/List/" + encodeURIComponent(route);
		if (route.startsWith("http")) return route;
		if (route.startsWith("/app")) return route;
		return "/app/" + route.replace(/^\//, "");
	},

	navigate(action, route) {
		if (!route || route === "#") return;

		if (action === "Link") {
			frappe.set_route("List", route);
			return;
		}
		if (route.startsWith("http")) {
			window.open(route, "_blank");
			return;
		}
		frappe.set_route(route);
	},

	set_active() {
		const $sidebar = $("#kt-sidebar");
		if (!$sidebar.length) return;

		const sub_path = (frappe.router.current_sub_path || "").toLowerCase();
		const route = frappe.router.current_route || [];

		$sidebar.find(".kt-sidebar-item").removeClass("active");

		$sidebar.find(".kt-sidebar-link").each((_, el) => {
			const $link = $(el);
			const action = $link.data("action");
			const item_route = ($link.data("route") || "").toLowerCase();

			if (action === "group") return;
			if (this.matches_route(action, item_route, sub_path, route)) {
				$link.closest(".kt-sidebar-item").addClass("active");
				$link.closest(".kt-sidebar-group").addClass("expanded");
			}
		});
	},

	init_form_sidebar() {
		const expanded = localStorage.getItem("kt_form_sidebar_expanded") === "1";

		// Wait for sidebar toggle button to be rendered (form loads async)
		const tryToggle = (retries) => {
			const $toggleBtn = $(".sidebar-toggle-btn");
			if (!$toggleBtn.length) {
				if (retries > 0) setTimeout(() => tryToggle(retries - 1), 200);
				return;
			}

			const $layoutSide = $(".layout-side-section");
			const isCurrentlyExpanded = $layoutSide.length && $layoutSide.is(":visible") && !$layoutSide.hasClass("hide-sidebar");

			if (!expanded && isCurrentlyExpanded) {
				$toggleBtn[0].click();
			} else if (expanded && !isCurrentlyExpanded) {
				$toggleBtn[0].click();
			}
		};

		setTimeout(() => tryToggle(10), 300);

		// Add "Show Sidebar" to form ⋯ menu (once per form)
		if (frappe.cur_frm) {
			const formId = frappe.cur_frm.doctype + ":" + frappe.cur_frm.docname;
			if (this._last_form_id !== formId) {
				this._last_form_id = formId;
				frappe.cur_frm.page.add_menu_item(
					__("Show Sidebar"),
					() => {
						const $btn = $(".sidebar-toggle-btn");
						if ($btn.length) $btn[0].click();
						const isVis = $(".layout-side-section").length && $(".layout-side-section").is(":visible") && !$(".layout-side-section").hasClass("hide-sidebar");
						localStorage.setItem("kt_form_sidebar_expanded", isVis ? "1" : "0");
					},
					true
				);
			}
		}
	},

	matches_route(action, item_route, sub_path, route) {
		if (action === "Link") {
			const slug = item_route.replace(/ /g, "-");
			return sub_path === slug || sub_path.startsWith(slug + "/");
		}
		if (action === "Workspace") {
			const slug = item_route.replace(/^\/app\//, "").toLowerCase();
			return sub_path === slug || sub_path.startsWith(slug + "/");
		}
		// Route
		const r = item_route.replace(/^\/app\//, "").replace(/^\/+/, "").toLowerCase();
		if (!r) return sub_path === "app" || sub_path === "workspace";
		return sub_path === r || sub_path.startsWith(r + "/");
	},

	init_toggle() {
		$(document).on("click", "#kt-sidebar .kt-sidebar-toggle", (e) => {
			e.stopPropagation();
			$("body").toggleClass("kt-sidebar-collapsed");
			$("body").toggleClass("kt-sidebar-expanded");
			const collapsed = $("body").hasClass("kt-sidebar-collapsed");
			localStorage.setItem("kt_sidebar_collapsed", collapsed ? "1" : "0");
			this.update_toggle_icon(collapsed);
		});

		$(document).on("click", "#kt-sidebar .kt-sidebar-link", (e) => {
			const $link = $(e.currentTarget);
			const action = $link.data("action");
			const name = $link.data("name");

			if (action === "group") {
				e.preventDefault();
				$(`#kt-sidebar .kt-sidebar-group[data-name="${name}"]`).toggleClass("expanded");
				const route = $link.data("route");
				if (route && route !== "#") {
					if (route.startsWith("http")) {
						window.open(route, "_blank");
					} else {
						this.navigate("Route", route);
					}
				}
				return;
			}

			const route = $link.data("route");
			if (!route || route === "#") {
				e.preventDefault();
				return;
			}

			if (route.startsWith("http")) return;
			e.preventDefault();
			this.navigate(action, route);
		});
	},

	update_toggle_icon() {
		// Icon rotation is handled by CSS (body.kt-sidebar-collapsed)
	},

	apply_toggle_state() {
		const collapsed = localStorage.getItem("kt_sidebar_collapsed") === "1";
		$("body").toggleClass("kt-sidebar-collapsed", collapsed);
		$("body").toggleClass("kt-sidebar-expanded", !collapsed);
		this.update_toggle_icon(collapsed);
	},
};

$(document).ready(function () {
	keytech_theme.init();
});
