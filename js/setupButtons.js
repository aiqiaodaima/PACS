
function setupButtons(studyViewer) {
    // Get the button elements
    
    
    var element = $('#dicomImage').get(0);
    var buttons = $(studyViewer).find('button');
	cornerstone.enable(element);
    cornerstoneTools.mouseInput.enable(element);
    cornerstoneTools.touchInput.enable(element);
	var annotationDialog = document.querySelector('.annotationDialog');
    var relabelDialog = document.querySelector('.relabelDialog');
    dialogPolyfill.registerDialog(annotationDialog);
    dialogPolyfill.registerDialog(relabelDialog);
	function getTextCallback(doneChangingTextCallback) {
        var annotationDialog  = $('.annotationDialog');
        var getTextInput = annotationDialog .find('.annotationTextInput');
        var confirm = annotationDialog .find('.annotationDialogConfirm');

        annotationDialog .get(0).showModal();

        confirm.off('click');
        confirm.on('click', function() {
            closeHandler();
        });

        annotationDialog .off("keydown");
        annotationDialog .on('keydown', keyPressHandler);

        function keyPressHandler(e) {
            // If Enter is pressed, close the dialog
            if (e.which === 13) {
                closeHandler();
            }
        }

        function closeHandler() {
            annotationDialog .get(0).close();
            doneChangingTextCallback(getTextInput.val());
            // Reset the text value
            getTextInput.val("");
        }
    }
	function changeTextCallback(data, eventData, doneChangingTextCallback) {
        var relabelDialog = $('.relabelDialog');
        var getTextInput = relabelDialog.find('.annotationTextInput');
        var confirm = relabelDialog.find('.relabelConfirm');
        var remove = relabelDialog.find('.relabelRemove');

        getTextInput.val(data.annotationText);
        relabelDialog.get(0).showModal();

        confirm.off('click');
        confirm.on('click', function() {
            relabelDialog.get(0).close();
            doneChangingTextCallback(data, getTextInput.val());
        });

        // If the remove button is clicked, delete this marker
        remove.off('click');
        remove.on('click', function() {
            relabelDialog.get(0).close();
            doneChangingTextCallback(data, undefined, true);
        });

        relabelDialog.off("keydown");
        relabelDialog.on('keydown', keyPressHandler);

        function keyPressHandler(e) {
            // If Enter is pressed, close the dialog
            if (e.which === 13) {
                closeHandler();
            }
        }
		function closeHandler() {
            relabelDialog.get(0).close();
            doneChangingTextCallback(data, getTextInput.val());
            // Reset the text value
            getTextInput.val("");
        }
        
    }
	var config = {
        getTextCallback : getTextCallback,
        changeTextCallback : changeTextCallback,
        drawHandles : false,
        drawHandlesOnHover : true,
        arrowFirst : true
    }
	cornerstoneTools.arrowAnnotate.setConfiguration(config);
	
	
    function activate(id){   
        $('a').removeClass('active');
        $(id).addClass('active');
    }
	activate("#activate");
	
	function deactivate () {
		cornerstoneTools.simpleAngle.deactivate(element,1);
		cornerstoneTools.arrowAnnotate.deactivate(element, 1);
        cornerstoneTools.arrowAnnotateTouch.deactivate(element);
	}
    // Tool button event handlers that set the new active tool

    // WW/WL
    $(buttons[0]).on('click touchstart', function() {
        disableAllTools();
       	deactivate ();
        forEachViewport(function(element) {
            cornerstoneTools.wwwc.activate(element, 1);
            cornerstoneTools.wwwcTouchDrag.activate(element);
        });
    });

    // Invert
    $(buttons[1]).on('click touchstart', function() {
        disableAllTools();
        deactivate ();
        forEachViewport(function(element) {
            var viewport = cornerstone.getViewport(element);
            // Toggle invert
            if (viewport.invert === true) {
                viewport.invert = false;
            } else {
                viewport.invert = true;
            }
            cornerstone.setViewport(element, viewport);
        });
    });

    // Zoom
    $(buttons[2]).on('click touchstart', function() {
        disableAllTools();
        deactivate ();
        forEachViewport(function(element) {
            cornerstoneTools.zoom.activate(element, 5); // 5 is right mouse button and left mouse button
            cornerstoneTools.zoomTouchDrag.activate(element);
        });
    });

    // Pan
    $(buttons[3]).on('click touchstart', function() {
        disableAllTools();
        deactivate ();
        forEachViewport(function(element) {
            cornerstoneTools.pan.activate(element, 3); // 3 is middle mouse button and left mouse button
            cornerstoneTools.panTouchDrag.activate(element);
        });
    });

    // 复位
    $(buttons[4]).on('click touchstart', function() {
        disableAllTools();
        deactivate ();
        forEachViewport(function(element) {
//      	var toolStateManager = cornerstoneTools.getElementToolStateManager(element);
//      	console.log(toolStateManager)
			cornerstoneTools.getElementToolStateManager(element).clear(element);

//			cornerstoneTools.clearToolState(element);
			cornerstone.updateImage(element);
        });
    });

    // Length measurement
    $(buttons[5]).on('click touchstart', function() {
        forEachViewport(function() {
    		disableAllTools();
        	deactivate ();
            cornerstoneTools.length.activate(element, 1);         
            return false;  
    	});     
    });
    $(buttons[5]).on('dblclick', function() {
        forEachViewport(function() {
    		cornerstoneTools.clearToolState(element, "length");
            cornerstone.updateImage(element);
    	})     
    });

    // Angle measurement
    $(buttons[6]).on('click touchstart', function() {
        disableAllTools();
		deactivate ();
        cornerstoneTools.simpleAngle.activate(element, 1);
        return false;
    });
	$(buttons[6]).on('dblclick', function() {
        forEachViewport(function() {
    		cornerstoneTools.clearToolState(element, "simpleAngle");
            cornerstone.updateImage(element);
    	})     
    });
	
	
	
    // 文字标注
    $(buttons[7]).on('click touchstart', function() {
        deactivate ();
        disableAllTools();
        forEachViewport(function(element) {
            cornerstoneTools.arrowAnnotate.activate(element, 1);
            cornerstoneTools.arrowAnnotateTouch.activate(element);
            return false;
        });
    });

    // Elliptical ROI
    $(buttons[8]).on('click touchstart', function() {
        disableAllTools();
        deactivate ();
        forEachViewport(function(element) {
            cornerstoneTools.ellipticalRoi.activate(element, 1);
        });
    });
	$(buttons[8]).on('dblclick', function() {
        forEachViewport(function() {
        	console.log($(buttons))
//      	$(buttons).removeClass('active');
			$(buttons).removeAttr('aria-describedby');
    		cornerstoneTools.clearToolState(element, "ellipticalRoi");
            cornerstone.updateImage(element);
    	})     
    });
	
	
	
	
    // Rectangle ROI
    $(buttons[9]).on('click touchstart', function() {
        disableAllTools();
        deactivate ();
        forEachViewport(function (element) {
            cornerstoneTools.rectangleRoi.activate(element, 1);
        });
    });
	$(buttons[9]).on('dblclick', function() {
        forEachViewport(function() {
    		cornerstoneTools.clearToolState(element, "rectangleRoi");
            cornerstone.updateImage(element);
    	})     
    });
	
	
	
    // Play clip
    $(buttons[10]).on('click touchstart', function() {
    	disableAllTools();
        deactivate ();
        forEachViewport(function(element) {
          var stackState = cornerstoneTools.getToolState(element, 'stack');
          var frameRate = stackState.data[0].frameRate;
          // Play at a default 10 FPS if the framerate is not specified
          if (frameRate === undefined) {
            frameRate = 1;
          }
          cornerstoneTools.playClip(element, frameRate);
        });
    });

    // Stop clip
    $(buttons[11]).on('click touchstart', function() {
    	disableAllTools();
        deactivate ();
        forEachViewport(function(element) {
            cornerstoneTools.stopClip(element);
        });
    });
	var num = 1;
	$(buttons[13]).click(function() {
        num++;
		var filename = num;
		forEachViewport(function(element) {
            cornerstoneTools.saveAs(element, filename);
        	return false;
        });
        
    });
	
    // Tooltips
    $(buttons[0]).tooltip();
    $(buttons[1]).tooltip();
    $(buttons[2]).tooltip();
    $(buttons[3]).tooltip();
    $(buttons[4]).tooltip();
    $(buttons[5]).tooltip();
    $(buttons[6]).tooltip();
    $(buttons[7]).tooltip();
    $(buttons[8]).tooltip();
    $(buttons[9]).tooltip();
    $(buttons[10]).tooltip();
    $(buttons[11]).tooltip();
    $(buttons[12]).tooltip();
	$(buttons[13]).tooltip();
};