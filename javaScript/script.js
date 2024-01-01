// console.log("Lets write some javascript.");
let currentSong = new Audio(0);
let songs;
let currFolder;
let coverUrl = "https://source.unsplash.com/random/160*154/?songs,music";
document.getElementById("volpercent").innerHTML = `${parseInt(currentSong.volume*100)}%`

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00.00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`/${folder}/`);
  let response = await a.text();
  // console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }


  //  show  ALII THE SONGS IN THE PLAYLIST'S
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li><img class="invert" src="img/music.svg" alt="music">
    <div class="info">
      <div>${song.replaceAll("%20", " ")}</div>
      <div>Two In One {DU}</div>
    </div>
    <div class="playnow">
      <span>Play Now</span>
      <img class="invert" src="img/play.svg" alt="Play">
    </div></li>`;
  }

  //  Attatch an event listner to each song //

  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      let a = e.querySelector(".info").firstElementChild.innerHTML;
      playMusic(a);
    });
  });
  return songs;

}

const playMusic = (track, pause = false) => {
  // let audio = new Audio("/songs/" + track)
  currentSong.src = `/${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "img/pause.svg";
  }

  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(
    ".songtime"
  ).innerHTML = `00:00 / ${currentSong.duration}`;
};

async function displayAlbums() {
  let a = await fetch(`/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer");
  let folders = [];
  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];

    if (e.href.includes("/songs/") && !e.href.includes(".htaccess")) {
      let folder = e.href.split("/").splice(-2)[0];
      //Get MetaData of the folder..............
      let a = await fetch(`/songs/${folder}/info.json`);
      let response = await a.json();
      // console.log(response);
      cardContainer.innerHTML =
        cardContainer.innerHTML +
        ` <div data-folder="${folder}" class="card">
      <div class="play">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 20V4L19 12L5 20Z"
            stroke="#141B34"
            fill="#000"
            stroke-width="1.5"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <img width="42" src="${coverUrl}" alt="cover Img" />
      <h2>${response.title}</h2>
      <p>${response.description}</p>
    </div>`;
    }
  }

  // Load the playlist whenever card is clicked................
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      // console.log(item.currentTarget , item.currentTarget.dataset)
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0])
    });
  });
}

async function main() {
  //Get the list of all songs
  await getSongs("songs/ncs");
  playMusic(songs[0], true);

  // Display all the albums on the page........
  displayAlbums();

  // Attatch an event listner to play, next and previous
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "img/pause.svg";
    } else {
      currentSong.pause();
      play.src = "img/play.svg";
    }
  });

  //Listen for time update Event
  currentSong.addEventListener("timeupdate", () => {
    // console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )}/${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  //  Add an eventlistener to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  // Add an event listner for hamburger  to open
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  // Add an event listner for hamburger to Close
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-130%";
  });

  // Add an Event Listner to Previous
  previous.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").splice(-1)[0]);
    if (index + 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });

  // Add an Event Listner to Next
  next.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").splice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);

    }
  });

  // Add an event to volume
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      // console.log("setting volume to " + e.target.value + "/100");
      currentSong.volume = parseInt(e.target.value)/100;
      // Add percent volume p Tag
      document.getElementById("volpercent").innerHTML = `${parseInt(e.target.value)}%`
      
    });
    
    
    // Add event listner to mute the track 
    document.querySelector(".volume>img").addEventListener("click", (e)=>{
      if(e.target.src.includes("img/volume.svg")){
        e.target.src =  e.target.src.replace("img/volume.svg", "img/mute.svg")
        currentSong.volume = 0;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
              // Add percent volume p Tag
        document.getElementById("volpercent").innerHTML = `${parseInt(currentSong.volume*100)}%`
      }
      else{
        e.target.src = e.target.src.replace("img/mute.svg", "img/volume.svg")
        currentSong.volume = .1
        document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
      // Add percent volume p Tag
        document.getElementById("volpercent").innerHTML = `${parseInt(currentSong.volume*100)}%`
      }
    })
}
main();
