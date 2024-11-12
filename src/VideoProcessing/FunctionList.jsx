// import ffmpegg


class VideoEditingFunction {
    constructor(name, params, func) {
      this.name = name;
      this.params = params;
      this.func = func;
    }
  
    execute(video, ...args) {
      // Validate parameters here, if needed
      return this.func(video, ...args);
    }
  }

const VideoEditingFunctions = [
    new VideoEditingFunction(
        'example',
        [
            {name:'vid1',type:"video"},
            {name:'vid2',type:"video"},
        ],
        (vid1 , vid2) =>{
            return vid1}
    ),
        
]