let currentSong = new Audio();
let songs;
let currFolder;
function formatTime(seconds) {
    const totalSeconds = Math.floor(Number(seconds)); // Convert and floor to remove decimals
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const formattedSecs = secs < 10 ? '0' + secs : secs;
    return `${mins}:${formattedSecs}`;
}



async function getSongs(folder) {
    currFolder = folder
    let a = await fetch(`/${folder}/`)
    let response = await a.text()
    // console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    // console.log(as);
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            let ele = element.href.split(`/${folder}/`)[1]
            songs.push(ele.split(".mp3")[0])

        }
    }
    let songUL = document.querySelector(".songslist").getElementsByTagName("ul")[0]
    let artists = ["Riyaz", "Mikasa", "Eren", "Levi", "Armin", "Erwin", "Sasha", "Jean", "Connie", "Hange"]
    songUL.innerHTML = ""
    for (const song of songs) {
        let artist = artists[Math.floor(Math.random() * artists.length)]
        songUL.innerHTML += `
        <li class="songinfoli">
                        <div class="songimg">
                            <img class="invert" src="Images/music.svg" alt="music">
                       
                            <div class="songinfo">
                                <div class="songname">${song.replaceAll("%20", " ")}</div>
                                <div>${artist}</div>
                            </div>
                        </div>
                            <div class="playnow">
                                <div>Play Now</div>
                                <img class="invert playnowbtn" src="Images/playsong.svg" alt="">
                            </div>
                        </li>
                        `

    }
    Array.from(document.querySelector(".songslist").getElementsByTagName("li")).forEach((ele) => {

        ele.addEventListener("click", () => {
            console.log(ele.querySelector(".songinfo").firstElementChild.innerHTML);
            let song = ele.querySelector(".songinfo").firstElementChild.innerHTML
            playSong(song)
            
        })

    })
}
function playSong(track, state = false) {
    // let audio=new Audio(`/${folder}/${track}.mp3`)

    currentSong.src = `/${currFolder}/${track}.mp3`
    if (!state) {
        currentSong.play()
        play.src = "Images/pausesong.svg"
    }
    console.log(track);

    // currentSong.play()
    // play.src="Images/pausesong.svg"
    let songName = document.querySelector(".currentsongname")
    songName.innerHTML = track.replaceAll("%20", " ")
    let songDuration = document.querySelector(".currentsongduration")
    songDuration.innerHTML = "00:00  /  00:00"
}
async function getAlbums() {
    let a = await fetch(`/Songs/`)
    let response = await a.text()
    // console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response
    let anchors = div.getElementsByTagName("a")
    // console.log(anchors);
    let array=Array.from(anchors)
    for (let element = 0; element < array.length; element++) {
        const ele = array[element];
        
  
        if (ele.href.includes("/Songs/")) {
            let folder = (ele.href.split("/").slice(-2)[0]);
            let a = await fetch(`/Songs/${folder}/info.json`)
            let response = await a.json()
            console.log(response);
            console.log(`Songs/${folder}/cover.jpeg`);
            
            let cardContainer = document.querySelector(".playlistcontainer")
            cardContainer.innerHTML+=`
            <div data-folder="${folder}" class="card">
                        <div class="cardplaybtn">
                            <img src="Images/playbtn.svg" alt="">
                        </div>
                        <img src="Songs/${folder}/cover.jpeg" alt="happy-hits">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
        }
    }
    Array.from(document.getElementsByClassName("card")).forEach(ele => {
        ele.addEventListener("click", async (item) => {
            currFolder = `Songs/${item.currentTarget.dataset.folder}`; // Update currFolder
            songs = await getSongs(currFolder); // Update songs array
            playSong(songs[0], true); // Play the first song in the new album

        });
    });
}
setTimeout(() => {

    if(currentSong.duration==currentSong.currentTime){
        playSong(songs[0])
    }
}, 1000);
async function main() {
    await getSongs("Songs/ncs")
    playSong(songs[0], true)
    await getAlbums()
    //add event listener to play or pause
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "Images/pausesong.svg"
        } else {
            currentSong.pause()
            play.src = "Images/playsong.svg"
        }
    })
    //add event listener for seek bar to move according to current time
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime)
        let songDuration = document.querySelector(".currentsongduration")
        songDuration.innerHTML = formatTime(currentSong.currentTime) + "  /  " + formatTime(currentSong.duration)
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    })
    // add event listener to use seek bar to jump to play song 
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        // console.log(e.offsetX,e.target.getBoundingClientRect().width);
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        currentSong.currentTime = currentSong.duration * (percent / 100)

    })
    // add event listener to hamburger icon
    let hamburger = document.querySelector(".hamburger")
    hamburger.addEventListener("click", () => {
        document.querySelector(".left").style.left = "0px"
        document.querySelector(".left").style.transition = "0.5s"
    })
    // add event listener to close icon
    let close = document.querySelector(".close")
    close.addEventListener("click", () => {
        document.querySelector(".left").style.left = "-350px"
        document.querySelector(".left").style.transition = "0.5s"
    })
    previous.addEventListener("click", () => {
        let cursong = currentSong.src.split("/").pop().split(".mp3")[0]; 
        
        let songlist=[]
        Array.from(document.querySelector(".songslist").getElementsByTagName("li")).forEach((ele) => {

                // console.log(ele.querySelector(".songinfo").firstElementChild.innerHTML);
                let song = ele.querySelector(".songinfo").firstElementChild.innerHTML
                // playSong(song)
                songlist.push(song)
        
    
        })
        let encocursong=cursong.replaceAll("%20"," ")
        
        let index = songlist.indexOf(encocursong); 
        console.log(index);
        if (index > 0) {
            playSong(songlist[index - 1]); // Play the previous song
        } else {
            alert("No previous song available.");
        }
    });
    next.addEventListener("click", () => {
        let cursong = currentSong.src.split("/").pop().split(".mp3")[0]; 
        
        let songlist=[]
        Array.from(document.querySelector(".songslist").getElementsByTagName("li")).forEach((ele) => {

       
                let song = ele.querySelector(".songinfo").firstElementChild.innerHTML
              
                songlist.push(song)
        
    
        })
        let encocursong=cursong.replaceAll("%20"," ")
      
        
        let index = songlist.indexOf(encocursong); 

        
        if (index < songlist.length - 1) {
            playSong(songlist[index + 1]); // Play the next song
        } else {
            alert("No next song available.");
        }
    });
    document.querySelector(".volumeslider").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log(e.target.value);
        currentSong.volume = e.target.value / 100

    })
    document.querySelector(".volume").addEventListener("click",(e)=>{
        console.log(e.target.src);
        if(e.target.src.includes("volume.svg")){
            e.target.src="Images/mute.svg"
            currentSong.volume=0
        }
        else{
            e.target.src="Images/volume.svg"
            currentSong.volume=1
        }
        
    })
    

}
main()


// console.log(formatTime(1000));


