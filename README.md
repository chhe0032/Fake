What is needed to run the app?

Base Path for Tracks: The base path for the tracks needs to be adjusted to the correct path on the user's system.

Javascript: L207 
const basePath = "C:\\Users\\Christoph\\Fake\\Vocal Imitation Auswahl\\"; 

Change this to match the folder structure on the user's system. 
Audio File Path: The path for playing the audio file needs to be adjusted to ensure it matches the user's system.

L211 
const filePath = `${basePath}${category}\\${category} - ${track}`; 
currentAudio = new Audio(`file:///${filePath}`); 

Play Icon Path: The path for the play icon needs to be updated to the correct path on the user's system. 
All Img Paths in the HTML File need to be updated 
Html: 
< img src="C:\Users\Christoph\Fake\Images\Chicken - Cluck.png" alt="Chicken" class="button-image"> 
<img src="C:\\Users\\Christoph\\Fake\\Icon\\Playbutton.png" alt="Play Icon" onclick="playTrack('${currentCategory}', 
'${selectedTrack}')"> 

Update this path to where the icon and images are located on the user's system. 
Ensure the filePath construction is correct for the folder structure on the user's system. 
