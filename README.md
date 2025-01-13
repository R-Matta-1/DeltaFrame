## deltaframe

a system for creating ffmepg complex filters

- made such that it is simple to add nodes
- made using reactflow, my first react project
  - (and consequently my first example of "modern" web development)

![data of the plan](Plan.jpg)

## creating a node,

the only difference between this and a regular reactflow node is that these nodes require using "DivHandle" as a wrapper of the regular handle and the requierment of an element in the data that can be found in the following

```jsx
function VideoScale({ id, Data }) {
  const { updateNodeData } = useReactFlow();
  const [Input, setInput] = useState("iw:ih:0:0");
  const [TutorialOpen, setTutorialOpen] = useState(false);
  useEffect(() => {
    updateNodeData(id, { FFmFilterNode: `scale=${Input}` });
    console.log(Input);
  }, [Input]);

  const InputHandle = (event) => {
    const newVal = event.target.value;
    const CleanVal = newVal.replace(/['"\s]/g, "");
    setInput(CleanVal);
  };

  const inputStyle = {
    display: "inline",
    width: "140px",
    fontSize: "10px",
    margin: "0",
    textAlign: "center",
  };
  return (
    <div
      style={{
        height: TutorialOpen ? "600px" : "90px",
        width: TutorialOpen ? "300px" : "180px",
        padding: "0",
        overflow: "clip",
      }}
      className="react-flow__node-default"
    >
      <p style={{ font: "16px Arial, sans-serif" }}>
        scale=
        <input
          onChange={InputHandle}
          style={inputStyle}
          placeholder="iw:ih:0:0"
        />
      </p>
      <button onClick={() => setTutorialOpen(!TutorialOpen)}>
        {TutorialOpen ? "close" : "open"} Tutorial
      </button>
      {TutorialOpen && <p>bla bla bla</p>)}
      <DivHandle
        type="target"
        id="2"
        position={Position.Left}
        mediaType={MediaTypes.VIDEO}
      />
      <DivHandle
        type="source"
        id="3"
        position={Position.Right}
        mediaType={MediaTypes.VIDEO}
      />
    </div>
  );
}
```

---

todo:

- consider defualt nodes / polymorphism templates
- image compatability
  - reactive divHandle on input
  - custom outfile name for types
- create nore nodes
- small style changes
  - reconsider font
  - defualt buttons
