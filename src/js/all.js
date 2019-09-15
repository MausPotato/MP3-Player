function showPlayer() {
  let player = document.getElementById('player');
  player.style.display = 'block';
}

function hidePlayer() {
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
    height: '200',
    width: '300',
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
    this.isLive = (response.result.items[0].snippet.liveBroadcastContent == 'live');
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

const REPEAT = {
  NONE: 0,
  ONE: 1,
  ALL: 2
}

class PlayList {
  constructor(title, description) {
    this.title = title;
    this.description = description;
    this.publishedAt = new Date(Date.now());
    this.list = [];
    //this.nowPlaying = this.list[0];
    this.init();
  }
  init() {
    this.shuffleMode = false;
    this.repeatMode = REPEAT.NONE;
    this.shuffle();
    this.repeat();
  }
  shuffle(index = -1) {
    let order = [];
    for (let i = 0; i < this.list.length; i++) {
      order.push(i);
    }
    if (this.shuffleMode == true) {
      let length = order.length;
      let random;
      while (length) {
        random = Math.floor(Math.random() * length--);
        [order[length], order[random]] = [order[random], order[length]];
      }
    }
    if (index != -1) {
      let translate = index - order[0] + order.length;
      for (let i = 0; i < order.length; i++) {
        order[i] = (order[i] + translate) % order.length;
      }
    }
    for (let i = 0; i < order.length; i++) {
      if (i == 0) {
        this.list[order[i]].prev = null;
      } else {
        this.list[order[i]].prev = this.list[order[i - 1]];
      }
      if (i == order.length - 1) {
        this.list[order[i]].next = null;
      } else {
        this.list[order[i]].next = this.list[order[i + 1]];
      }
    }
  }
  repeat() {
    if (this.repeatMode == REPEAT.ONE) {
      for (let item of this.list) {
        item.next = item;
        item.prev = item;
      }
    }
  }
  play() {
    if (this.list.length == 0) {
      //to do: try to play when this.list = empty;
      return;
    }
    this.nowPlaying = this.list[0];
    this.list[0].video.play();
  }
  add(id) {
    Video.getVideoFromYoutube(id).then((video) => {
      if (!video.isLive) {
        let listItem = {
          video: video,
        }
        this.list.push(listItem);
      } else {
        alert('這個4直播捏, 加入失敗');
        //return false;
      }
    })
  }
  delete(index) {
    let deleteItem = this.list.splice(index, 1);
    deleteItem.prev.next = deleteItem.next;
    deleteItem.next.prev = deleteItem.prev;
  }
  refreshOrder() {

  }

}