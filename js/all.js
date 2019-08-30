function showPlayer() {
  let player = document.getElementById('player');
  player.style.display = 'block';
}

function hiddenPlayer() {
  let player = document.getElementById('player');
  player.style.display = 'none';
}

var isGpiReady = false;
var isPlayerReady = false;

function loadGpi() {
  gapi.load('client', function() {
    isGpiReady = true;
  });
}

function loadPlayer() {
  let tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  let firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function onYouTubeIframeAPIReady() {
  console.log('Hello');
  Video.player = new YT.Player('player', {
    height: '390',
    width: '640',
    events: {
      'onReady': function() {
        isPlayerReady = true;
        Video.setVolume(50);
      },
    }
  });
}

loadGpi();
loadPlayer();
/*window.onload = function() {
	alert(CONFIG.APIKEY);
}*/

/*
<li><span>Jesscia</span><button class="mbtn">minus</button></li>
<li><span>YouTube Music</span><button class="mbtn">minus</button></li>
<li><span>November</span><button class="mbtn">minus</button></li>
<li><span>Space Hunter</span><button class="mbtn">minus</button></li>
<li><span>The Path Starts Here</span><button class="mbtn">minus</button></li>
<li><span>If I Had a Chicken</span><button class="mbtn">minus</button></li>
<li><span>They Might Not</span><button class="mbtn">minus</button></li>
<li><span>There's Life Out</span><button class="mbtn">minus</button></li>
<li><span>prightly Pursuit</span><button class="mbtn">minus</button></li>
<li><span>Jesscia</span><button class="mbtn">minus</button></li>
<li><span>YouTube Music</span><button class="mbtn">minus</button></li>
<li><span>November</span><button class="mbtn">minus</button></li>
<li><span>Space Hunter</span><button class="mbtn">minus</button></li>
<li><span>The Path Starts Here</span><button class="mbtn">minus</button></li>
<li><span>If I Had a Chicken</span><button class="mbtn">minus</button></li>
<li><span>They Might Not</span><button class="mbtn">minus</button></li>
<li><span>There's Life Out</span><button class="mbtn">minus</button></li>
<li><span>prightly Pursuit</span><button class="mbtn">minus</button></li>
*/

class Video {
  constructor(response) {
    this.title = response.result.items[0].snippet.title;
    this.duration = response.result.items[0].contentDetails.duration;
    this.id = response.result.items[0].id;
    this.img = response.result.items[0].snippet.thumbnails.default;
  }
  show() {
    console.log(`title: ${this.title}\nduration: ${this.duration}\nid: ${this.id}`);
  }
  play() {
    if (!isPlayerReady) {
      console.error('Player is not ready!');
    }
    Video.player.loadVideoById({
      videoId: this.id,
      suggestedQuality: 'small'
    });
  }
  resume() {
    Video.player.playVideo();
  }
  pause() {
    Video.player.pauseVideo();
  }
  static getVideoFromYoutube(id) {
    if (!isGpiReady) {
      console.error('Gpi is not ready. Please try again later.');
    }
    return gapi.client.init({
        'apiKey': CONFIG.APIKEY,
        'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
      }).then(function() {
        return gapi.client.youtube.videos.list({
          part: 'contentDetails,snippet',
          id: id,
        });
      }).then(
          response => {
            return new Video(response);
          },
          reason => console.log('E', reason)
    );
  }
  static setVolume(volume) {
    Video.player.setVolume(volume);
  }
}

