## deltaframe

a system for creating ffmepg complex filters

- made such that it is simple to add nodes
- made using reactflow, my first react project
  - (and consequently my first example of "modern" web development)

![data of the plan](Plan.jpg)

## creating a node,

the only difference between this and a regular reactflow node is that these nodes require using "DivHandle" as a wrapper of the regular handle and the requierment of an element in the data that can be found in the following

```jsx
const VideoScale = CreateNodeType(
  "crop=", // lable
  "iw:-1:0:0", // placeholder
  "https://trac.ffmpeg.org/wiki/Blend", // some tutorial link
  [
    // handles as shown
    {
      type: "target",
      mediaType: MediaTypes.VIDEO,
      position: Position.Left,
      style: {},
    },
    {
      type: "source",
      mediaType: MediaTypes.VIDEO,
      position: Position.Right,
      style: {},
    },
  ]
);
```

---

todo:

- more nodes
- sort out iframe
- small style changes
  - defualt buttons
