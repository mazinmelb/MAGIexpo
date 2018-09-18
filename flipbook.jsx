
{
  app.beginUndoGroup("Flipbook");

  // Creating project
  var currentProject  = (app.project) ? app.project : app.newProject();

  // set timing to flip up over .3 secs, stay viewable for .5 secs change this numbers to change timing
  var flipSecs = .1;
  var viewableSecs = .2;
 
  // position the images so they completely disappear
  var beginFlipPos = [-5000,107];
  var endFlipPos = [3500,2000];
  
  // add in some jitter so it looks more human and less computer
  var jitter = true;  
  

  // scale images to 70% of comp size
 var scaleImages = 70;  
 var imagePos = [1600,780];
  
  // Creating comp
  var compSettings    = cs = [3200, 1641, 1, 10, 24];
  /*
  var anchorPoint = [2500,300];
  var avPos = [1600,820.5];
  var hiddenRot = -30;
  var topRot = 30;
  var viewRot = 0;
  */
  var defaultCompName = "Flipbook";
  
   // Creating viewfinder layer
   var currentComp     = (currentProject.activeItem) ? currentProject.activeItem : currentProject.items.addComp(defaultCompName, cs[0], cs[1], cs[2], cs[3], cs[4]);

   
  // Creating background layer
   var backgroundLayer = currentComp.layers.addSolid([93, 5, 2], "Background", cs[0], cs[1], cs[2]);

   currentComp.openInViewer();
 
  var w = new Window ("dialog");
  var importDone = false;

  
  myButtonGroup = w.add ("group");  
  //myButtonGroup.orientation = "column";   
 
  var importFromFolder =myButtonGroup.add ("button", undefined, "Import From Folder");
  var cancelIt =myButtonGroup.add ("button", undefined, "Finish");

  importFromFolder.onClick = ImportLogos();
  cancelIt.onClick = function()
    {
            importDone = true;
            return;
      }

 if (importDone==false)
 {
   
  w.show();
  }

     
  function ImportLogos () {
 
 
                var targetFolder = Folder.selectDialog("Import Student files From Folder");
               
                if (targetFolder) 
                {
                                        var files = targetFolder.getFiles();
                                            for (var i = 0; i < files.length-1; i++)
                                            {
                                                try {
                                                    // import the image files
                                                    var importOptions = new ImportOptions (files[i]);                                                                
                                                    app.project.importFile (importOptions);
                                                } catch (error) { /*alert(error.toString());*/}
                                           }
                        }
               
                var proj = app.project;
                var selection = proj.selection;
                imgComp = currentComp;
                // scale images to 70% of comp size
                var scaleImages = 70;
                var indicies = [];
               // var imgComp =logosLayer.addComp ("images", cs[0], cs[1], cs[2], cs[3], cs[4]);


                    // rescale layer to comp size (template code is above in fuction)
                    var scale;

                    // add each image to composition
                for (var i = 0; i < selection.length; i++)
                {
                    thisOne = imgComp.layers.add(selection[i]);
                    thisOne.property("Position").setValue(imagePos);                    

                     // set scale to fit to composition width - this isn't very successful and needs tweaking after aep is created
                    scale = (imgComp.width)/(thisOne.width)*scaleImages;
                    thisOne.property("Scale").setValue([scale,scale]);

                    // set timing so each one shows for the number of viewable seconds
                    hiddenAttTime = i*(flipSecs+viewableSecs);
                    startFlip = hiddenAttTime;
                    
                   // overshoot with a jittery motion 
                    if (jitter == true){
                            // make the timing very slightly different for random amoutn of time to feel more hand-flipped
                             jitterSecs=  (Math.floor(Math.random() * Math.floor(3)))/10;}
                       else { 
                           // otherwise there's no jitter
                           jitterSecs=0;}
     
                    endFlip = hiddenAttTime+flipSecs;
                    startWipe = endFlip+viewableSecs;
                    endWipe = startWipe + flipSecs+jitterSecs;
                    
                     // add the page turn effect to the images                
                    var flipEffect = thisOne.effect.addProperty ("CC Page Turn");       
                    flipEffect.property("Fold Position").setValueAtTime(startFlip,beginFlipPos);
                    flipEffect.property("Fold Position").setValueAtTime(endFlip,endFlipPos);
                    
                    // add the wipe effect so that you can;t see larger images underneath smaller ones
                    var wipeEffect = thisOne.effect.addProperty("Linear Wipe");
                    wipeEffect.property("Wipe Angle").setValue(90);
                    wipeEffect.property("Transition Completion").setValueAtTime(startWipe,0);
                    wipeEffect.property("Transition Completion").setValueAtTime(endWipe,100);
                    
                 totalSecs += flipSecs+viewableSecs;
                indicies.push(i+1);
                    }
            imgComp.layers.precompose(indicies,"images",true);
            imgComp.duration = i*(flipSecs+viewableSecs)+flipSecs;
            importDone = true;
     
            }   
     


  
  
  
  
  app.endUndoGroup();
}
