## deltaframe

a system for creating ffmepg complex filters

- made such that it is simple to add nodes
- made using reactflow, my first react project
  - (and consequently my first example of "modern" web development)

![data of the plan](Plan.jpg)

## creating a node,

the only difference between this and a regular reactflow node is that these nodes require using "DivHandle" as a wrapper of the regular handle and the requierment of an element in the data that can be found in the following

```jsx
function VideoDifference({ id, Data }) {
  const { updateNodeData } = useReactFlow();
  useEffect(() => {
    updateNodeData(id, { FFmFilterNode: "blend=difference" });
  }, []);
  return (
    <>
      <div
        style={{ height: "20%", padding: "0" }}
        className="react-flow__node-default"
      >
        <p style={{ font: "15px Verdana" }}>Difference</p>

        <DivHandle
          type="target"
          id="1"
          position={Position.Left}
          mediaType={MediaTypes.VIDEO}
          style={{ top: "75%" }}
        />
        <DivHandle
          type="target"
          id="2"
          position={Position.Left}
          mediaType={MediaTypes.VIDEO}
          style={{ top: "25%" }}
        />

        <DivHandle
          type="source"
          id="3"
          position={Position.Right}
          mediaType={MediaTypes.VIDEO}
        />
      </div>
    </>
  );
```

---

todo:

- [x] impliment sample clips with ffmpeg.wasm
- [ ] ffmpeg code generator WITH audio and more complex output support
- [ ] style everything
- [ ] more settings for input node (-ss and file name edit)
- [ ] settings for output
  - output ctf output time
- [ ] create more nodes
- [ ] place on github pages
