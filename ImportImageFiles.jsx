﻿1{  app.beginUndoGroup("Demo Script");  // Creating project  var currentProject  = (app.project) ? app.project : app.newProject();  // set timeing to shift up over 1 second  var moveUpSecs = .5;  var viewableSecs = 2;    var jitter = false;      // Creating comp  var compSettings    = cs = [1280, 720, 1, 10, 24];  var anchorPoint = [2500,300];  var avPos = [2600,350];  var hiddenRot = -30;  var topRot = 30;  var viewRot = 0;  var defaultCompName = "Viewfinder";     // Creating viewfinder layer   var currentComp     = (currentProject.activeItem) ? currentProject.activeItem : currentProject.items.addComp(defaultCompName, cs[0], cs[1], cs[2], cs[3], cs[4]);   //var viewLayer = currentComp.layers.add (myComp);   currentComp.openInViewer();   var w = new Window ("dialog");  var importDone = false;    myButtonGroup = w.add ("group");    //myButtonGroup.orientation = "column";      var importFromFolder =myButtonGroup.add ("button", undefined, "Import From Folder");  var cancelIt =myButtonGroup.add ("button", undefined, "Finish");  importFromFolder.onClick = ImportFilesFromFolder();  cancelIt.onClick = function(){            importDone = true;            return;      } if (importDone==false) {  w.show();  }    /*    function ImportFile () {         var targetFile = File.openDialog("Import File");               if (targetFile) {                  var importOptions = new ImportOptions (targetFile);                                                                                  app.project.importFile (importOptions);                                }    }       */       function ImportFilesFromFolder () {                  var targetFolder = Folder.selectDialog("Import Student files From Folder");                               if (targetFolder)                 {                                        var files = targetFolder.getFiles();                                            for (var i = 0; i < files.length-1; i++)                                            {                                                try {                                                    var importOptions = new ImportOptions (files[i]);                                                                                                                    app.project.importFile (importOptions);                                                } catch (error) { /*alert(error.toString());*/}                                           }                        }                               var proj = app.project;                var selection = proj.selection;                                for (var i = 0; i < selection.length; i++){                    viewableAtTime = i*(moveUpSecs+viewableSecs);                    startMoveIn = viewableAtTime;                    endMoveIn = viewableAtTime+moveUpSecs;                    startMoveOut = endMoveIn+viewableSecs;                    endMoveOut = startMoveOut+moveUpSecs;                                        // add a bit of jittery movement for .2 secs and random degrees between 0 and 2                    jitterSecs= .2;                    jitterDegrees =  Math.floor(Math.random() * Math.floor(3));                                        thisOne = currentComp.layers.add(selection[i]);                    thisOne.property("Position").setValue(avPos);                    thisOne.property("Anchor Point").setValue(anchorPoint);                    thisOne.property("Rotation").setValueAtTime(0,hiddenRot);                    thisOne.property("Rotation").setValueAtTime(startMoveIn,hiddenRot);                                        // overshoot with a jittery motion                     if (jitter == true){                            thisOne.property("Rotation").setValueAtTime(endMoveIn-jitterSecs,viewRot+jitterDegrees);}                                        thisOne.property("Rotation").setValueAtTime(endMoveIn,viewRot);                    thisOne.property("Rotation").setValueAtTime(endMoveIn,viewRot);                    thisOne.property("Rotation").setValueAtTime(startMoveOut,viewRot);                    thisOne.property("Rotation").setValueAtTime(endMoveOut,topRot);                    thisOne.property("Rotation").setValueAtTime(endMoveOut+moveUpSecs,180);         /*                    mymsg = ""                    mymsg += "Start move in "+startMoveIn+"\n";                    mymsg += "Jitter at "+startMoveIn+"\n";                    mymsg += "End move in "+endMoveIn+"\n";                    mymsg += "Start move out "+startMoveOut+"\n";                    mymsg += "End move out "+endMoveOut+"\n";                    alert(mymsg);                  */                }            importDone = true;                 }                  app.endUndoGroup();}