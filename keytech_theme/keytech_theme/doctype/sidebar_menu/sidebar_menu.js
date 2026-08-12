// Copyright (c) 2026, Keytech and contributors
// For license information, please see license.txt

const OCTICON_LIST = [
	"octicon octicon-home", "octicon octicon-person", "octicon octicon-package",
	"octicon octicon-file-text", "octicon octicon-graph", "octicon octicon-gear",
	"octicon octicon-tag", "octicon octicon-calendar", "octicon octicon-checklist",
	"octicon octicon-rocket", "octicon octicon-people", "octicon octicon-shield",
	"octicon octicon-bell", "octicon octicon-database", "octicon octicon-tools",
	"octicon octicon-light-bulb", "octicon octicon-organization", "octicon octicon-milestone",
	"octicon octicon-project", "octicon octicon-tasklist", "octicon octicon-alert",
	"octicon octicon-archive", "octicon octicon-bookmark", "octicon octicon-briefcase",
	"octicon octicon-bug", "octicon octicon-cart", "octicon octicon-check",
	"octicon octicon-clock", "octicon octicon-code", "octicon octicon-comment",
	"octicon octicon-comment-discussion", "octicon octicon-credit-card", "octicon octicon-download",
	"octicon octicon-edit", "octicon octicon-eye", "octicon octicon-eye-closed",
	"octicon octicon-file", "octicon octicon-file-binary", "octicon octicon-file-code",
	"octicon octicon-file-directory", "octicon octicon-file-media", "octicon octicon-file-pdf",
	"octicon octicon-file-zip", "octicon octicon-flame", "octicon octicon-fold",
	"octicon octicon-gift", "octicon octicon-git-branch", "octicon octicon-git-commit",
	"octicon octicon-git-compare", "octicon octicon-git-merge", "octicon octicon-git-pull-request",
	"octicon octicon-globe", "octicon octicon-grabber", "octicon octicon-grid",
	"octicon octicon-hash", "octicon octicon-heart", "octicon octicon-history",
	"octicon octicon-hourglass", "octicon octicon-hubot", "octicon octicon-image",
	"octicon octicon-inbox", "octicon octicon-issue", "octicon octicon-issue-closed",
	"octicon octicon-issue-opened", "octicon octicon-issue-reopened", "octicon octicon-key",
	"octicon octicon-law", "octicon octicon-link", "octicon octicon-link-external",
	"octicon octicon-list-ordered", "octicon octicon-list-unordered", "octicon octicon-location",
	"octicon octicon-lock", "octicon octicon-log-in", "octicon octicon-log-out",
	"octicon octicon-mail", "octicon octicon-mail-read", "octicon octicon-mark-github",
	"octicon octicon-markdown", "octicon octicon-megaphone", "octicon octicon-mention",
	"octicon octicon-menu", "octicon octicon-mirror", "octicon octicon-mortar-board",
	"octicon octicon-mute", "octicon octicon-no-newline", "octicon octicon-octoface",
	"octicon octicon-paintbrush", "octicon octicon-pencil", "octicon octicon-pin",
	"octicon octicon-play", "octicon octicon-plug", "octicon octicon-plus",
	"octicon octicon-plus-circle", "octicon octicon-power", "octicon octicon-project",
	"octicon octicon-pulse", "octicon octicon-question", "octicon octicon-quote",
	"octicon octicon-radio-tower", "octicon octicon-repo", "octicon octicon-repo-clone",
	"octicon octicon-repo-forked", "octicon octicon-repo-pull", "octicon octicon-repo-push",
	"octicon octicon-rocket", "octicon octicon-rss", "octicon octicon-ruby",
	"octicon octicon-search", "octicon octicon-server", "octicon octicon-settings",
	"octicon octicon-shield", "octicon octicon-sign-in", "octicon octicon-sign-out",
	"octicon octicon-skip", "octicon octicon-sleep", "octicon octicon-sliders",
	"octicon octicon-smiley", "octicon octicon-star", "octicon octicon-star-fill",
	"octicon octicon-stop", "octicon octicon-stopwatch", "octicon octicon-sync",
	"octicon octicon-tag", "octicon octicon-tasklist", "octicon octicon-telescope",
	"octicon octicon-terminal", "octicon octicon-text-size", "octicon octicon-three-bars",
	"octicon octicon-thumbsdown", "octicon octicon-thumbsup", "octicon octicon-trashcan",
	"octicon octicon-triangle-down", "octicon octicon-triangle-left", "octicon octicon-triangle-right",
	"octicon octicon-triangle-up", "octicon octicon-unfold", "octicon octicon-unmute",
	"octicon octicon-upload", "octicon octicon-verified", "octicon octicon-versions",
	"octicon octicon-watch", "octicon octicon-x", "octicon octicon-zap"
];

frappe.ui.form.on("Sidebar Menu", {
	refresh(frm) {
		setup_icon_picker_button(frm);
		show_icon_preview(frm);
		toggle_route_fields(frm);
	},

	action(frm) {
		if (frm.doc.action !== "Link") {
			frm.set_value("link_doctype", "");
		}
		toggle_route_fields(frm);
	},

	icon(frm) {
		show_icon_preview(frm);
	},

	link_doctype(frm) {
		if (frm.doc.action === "Link" && frm.doc.link_doctype) {
			frm.set_value("route_or_link", frm.doc.link_doctype);
		}
	}
});

function setup_icon_picker_button(frm) {
	const $wrapper = frm.fields_dict.icon.$wrapper;
	$wrapper.find(".kt-icon-picker-btn").remove();

	const $btn = $(`<button class="btn btn-xs btn-default kt-icon-picker-btn" style="margin-left:6px;">
		<i class="octicon octicon-search" style="font-size:12px;"></i> ${__("Pick")}
	</button>`);

	$btn.on("click", function (e) {
		e.preventDefault();
		open_icon_picker(frm);
	});

	$wrapper.find(".control-input-wrapper").css("display", "flex").append($btn);
}

function show_icon_preview(frm) {
	const $wrapper = frm.fields_dict.icon.$wrapper;
	$wrapper.find(".kt-icon-preview").remove();

	if (frm.doc.icon) {
		$wrapper.find(".control-input-wrapper").after(
			`<div class="kt-icon-preview" style="margin-top:6px;display:flex;align-items:center;gap:8px;padding:6px 10px;border:1px solid var(--border-color);border-radius:6px;background:var(--bg-color);">
				<i class="${frm.doc.icon}" style="font-size:20px;color:var(--text-color);"></i>
				<span style="font-size:11px;color:var(--text-muted);font-family:monospace;">${frm.doc.icon}</span>
			</div>`
		);
	}
}

function toggle_route_fields(frm) {
	if (frm.doc.action === "Link") {
		frm.toggle_display("link_doctype", true);
		frm.toggle_reqd("link_doctype", true);
		frm.fields_dict.route_or_link.$wrapper.hide();
	} else {
		frm.toggle_display("link_doctype", false);
		frm.toggle_reqd("link_doctype", false);
		frm.fields_dict.route_or_link.$wrapper.show();
		frm.toggle_reqd("route_or_link", true);
	}
}

function open_icon_picker(frm) {
	const selected = frm.doc.icon || "";

	const $grid = $("<div>").css({
		"display": "grid",
		"grid-template-columns": "repeat(8, 1fr)",
		"gap": "4px",
		"max-height": "420px",
		"overflow-y": "auto",
		"padding": "4px"
	});

	OCTICON_LIST.forEach(function (cls) {
		const name = cls.replace("octicon octicon-", "");
		const is_selected = cls === selected;

		const $item = $("<div>")
			.css({
				"display": "flex",
				"flex-direction": "column",
				"align-items": "center",
				"justify-content": "center",
				"padding": "8px 2px",
				"border": is_selected ? "2px solid var(--primary)" : "1px solid var(--border-color)",
				"border-radius": "6px",
				"cursor": "pointer",
				"background": is_selected ? "var(--bg-blue-50)" : "",
				"min-height": "60px",
				"transition": "all 0.12s"
			})
			.attr("title", name)
			.append($("<i>").addClass(cls).css({ "font-size": "20px", "margin-bottom": "4px" }))
			.append($("<span>").text(name).css({
				"font-size": "8px",
				"color": "var(--text-muted)",
				"text-align": "center",
				"word-break": "break-all",
				"line-height": "1.1",
				"max-width": "70px"
			}));

		$item.on("mouseenter", function () { $(this).css("background", "var(--bg-blue-50)"); });
		$item.on("mouseleave", function () { if (!is_selected) $(this).css("background", ""); });

		$item.on("click", function () {
			frm.set_value("icon", cls);
			d.hide();
		});

		$grid.append($item);
	});

	const $search = $("<input>")
		.attr("type", "text")
		.attr("placeholder", __("Search icon..."))
		.css({
			"width": "100%",
			"padding": "8px 12px",
			"margin-bottom": "8px",
			"border": "1px solid var(--border-color)",
			"border-radius": "6px",
			"outline": "none",
			"font-size": "13px"
		});

	$search.on("input", function () {
		const q = $(this).val().toLowerCase();
		$grid.find("[title]").each(function () {
			const title = ($(this).attr("title") || "").toLowerCase();
			$(this).parent().toggle(title.includes(q));
		});
	});

	const $body = $("<div>").css("padding", "8px").append($search).append($grid);

	const d = new frappe.ui.Dialog({
		title: __("Pick an Icon"),
		primary_action_label: null,
		primary_action: function () { d.hide(); },
		size: "large"
	});
	d.$body.empty().append($body);
	d.show();

	setTimeout(function () { $search.focus(); }, 300);
}
