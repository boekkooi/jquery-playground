/*!
 * jQuery UI Selectable click widget
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */
(function( $, undefined ) {

$.widget("ui.selectable_click", {
	options: { },
	_create: function() {
		var that = this;

		this.element.addClass("ui-selectable");

        this.element
            .bind('click.'+this.widgetName, function(event) {
                return that._mouseClick(event);
            });
	},

	_destroy: function() {
		this.element
			.removeClass("ui-selectable ui-selectable-disabled");
        this.element.unbind('.'+this.widgetName);
	},

    _mouseClick: function(event) {
        if(this.options.disabled) {
            return;
        }

        // TODO add support for filtering
        var currentItem = $(event.target);

        //Find out which items to select and deselect
        var deactivated = [];
        var activated = this.element.find('.ui-selected');
        currentItem = currentItem.filter(function(i, item) {
            var rmIndex = $.inArray(item, activated);
            if (!event.ctrlKey) {
                deactivated = activated;
                activated = [];
                if (rmIndex >= 0 && deactivated.length > 1) {
                    activated = [ deactivated[rmIndex] ];
                    deactivated.splice(rmIndex, 1);
                    return false;
                }
            }
            if (rmIndex >= 0) {
                if (event.ctrlKey) {
                    deactivated = [ activated[rmIndex] ];
                    activated.splice(rmIndex, 1);
                }
                return false;
            }
            return true;
        });

        // Fire deselected event if needed
        if (deactivated.length > 0) {
            $(deactivated).removeClass('ui-selected');
            this._trigger("unselected", event, {
                deactivated: deactivated
            });
        }

        // Add target to selected if it was not deactivated
        if (currentItem.length > 0) {
            currentItem.addClass('ui-selected');
            activated.push(currentItem);
        }

        // Fire selected event if needed
        if (activated.length > 0) {
            this._trigger("selected", event, {
                selected: activated
            });
        }
    }
});

})(jQuery);
