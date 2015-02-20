var app = angular.module('dragDrop', [])

// Simple array to iterate over to generate the draggable elements
app.controller('dragDropController', ['$scope',
	function($scope) {
		$scope.items = [1, 2, 3, 4, 5];
	}
]);

// Adds the draggable options (HTML5) to each element
app.directive('draggableItem', function() {
	return function(scope, element) {
		var el = element[0];

		// add the draggable attribute to the element 
		el.draggable = true;

		// append the draggableItem class to allow us to find the element later on
		el.className = el.className + " draggableItem";

		el.addEventListener(
			'dragstart',
			function(e) {
				e.dataTransfer.effectAllowed = 'copy';
				e.dataTransfer.setDragImage(el,0,0);

				var draggableList = document.querySelectorAll(".draggableItem");
				var index = -1;

				// identify the element that is being dragged by its index in the list of draggable items on the page
				for (var draggableIndex = 0; draggableIndex < draggableList.length; draggableIndex++) {
					if (el == draggableList[draggableIndex]) {
						index = draggableIndex;
					}
				}

				// Save the index of the item were dragging to be used by the drop event on another element 
				e.dataTransfer.setData('DraggableItemIndex', index);
				this.classList.add('drag');
				return true;
			}
		);

		// Event listener for when you stop dragging an element
		el.addEventListener(
			'dragend',
			function(e) {
				this.classList.remove('drag');
				return true;

			},

			true

		);

	}

});

// Adds the droppable options (HTML5) to each element
app.directive('droppableItem', function() {
	return {
		scope: {},
		link: function(scope, element) {
			var el = element[0];

			// What happens when an item is dragged over a droppable element
			el.addEventListener(
				'dragover',
				function(e) {
					e.dataTransfer.dropEffect = 'copy';

					if (e.preventDefault) e.preventDefault();
					this.classList.add('over');
				}
			);

			// What happens when an item has begun to be dragged over a droppable element
			el.addEventListener(
				'dragenter',
				function(e) {
					this.classList.add('over');
				}
			);

			// What happens when an item has ended its dragging over a droppable element
			el.addEventListener(
				'dragleave',
				function(e) {
					this.classList.remove('over');
				}
			);

			// What happens when an item has been dropped over a droppable element
			el.addEventListener(
				'drop',
				function(e) {
					if (e.stopPropagation) e.stopPropagation();

					this.classList.remove('over');


					// Take the index that was saved in the "drag" event of a draggable item and use it to find that item 
					var srcItemIndex = parseInt(e.dataTransfer.getData('DraggableItemIndex'));

					// Get the list of draggable items 
					var draggableList = document.querySelectorAll(".draggableItem");

					/* check to make sure the index that was saved is valid, if it is append the item to the new 
					 container, if its not log an error. */
					if ( typeof srcItemIndex == "number" && srcItemIndex >= 0 && srcItemIndex + 1 <= draggableList.length) {
						var srcItem = draggableList[srcItemIndex];
						this.appendChild(srcItem);
					} else {
						if (window.console && window.console.log) {

							console.log('ERROR: Drag and Drop module tried to add an element with an index,' +
							'that was outside of the array of movable items or a element that was not found');
						}
					}

					return false;
				},
				false
			);
		}
	}
});