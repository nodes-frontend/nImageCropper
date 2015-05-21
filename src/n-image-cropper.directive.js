(function () {
	'use strict';

	angular
		.module('nImageCropper')
		.directive('moduleName', moduleName);

	/* @ngInject */
	function moduleName($filter) {

		var directive = {
			restrict: 'EA',
			link: link,
			templateUrl: 'n-image-cropper.template.html',
			scope: {
				croppedImg: '=',
				imageSrc: '=',
                height: '=',
                width: '=',
			}
		};
		return directive;

		function link(scope, element, attrs) {
			
			// Attribute parsing
            scope.showChooseFile = (attrs.chooseFile === 'true') ? true : false;
            scope.showSelectFile = (attrs.selectFile === 'true') ? true : false;
            scope.showControls = (scope.imageSrc.length > 0) ? true : false;
            scope.disabled = (attrs.disabled === 'true') ? true : false;
            scope.showCropButton = true;
            scope.showExport = false;
            scope.editing = false;

            // Cached ref to inner element, parent, crop-preview-area and crop-background-area
            var elem = element.first();
            var previewElem = elem.find('.cropit-image-preview');
            var bgElem = elem.find('.cropit-image-background-container');

            // Private settings, not modifyable
            var privateSettings = {
                imageBackground           : true,
                imageBackgroundBorderWidth: 25,
                allowCrossOrigin          : true,
                onFileChange              : onFileChange,
                exportZoom                : 1
            };
            // Public settings, defined on the directive element
	        var publicSettings = scope.$eval(attrs.imageCrop) || {};
            // Merge settings
            var settings = angular.extend(publicSettings, privateSettings);

            // Init the plugin
            el.cropit(settings);

            scope.$watch('imageSrc', function(newImageUrl, oldImageUrl) {
                if(!newImageUrl) return;
                el.cropit('imageSrc', scope.imageSrc);
            });

            if(scope.disabled) {
                el.cropit('disable');
            }

            scope.enable = function() {
            	el.cropit('reenable');
                scope.editing = true;
                scope.disabled = false;
            }

            scope.disable = function() {
            	scope.disabled = true;
                scope.editing = false;
                el.cropit('disable');
                scope.export(); //if you want to
            }

            scope.export = function() {
				var croppedImage = el.cropit('export', {
                    type        : 'image/png',
                    originalSize: true,
                    quality     : 1,
                    fillBg      : '#000'
                });
                scope.croppedImg = croppedImage;
            }

            function onFileChange() {
                scope.disable = false;
                scope.$apply();
            }
		}

	}

})();
