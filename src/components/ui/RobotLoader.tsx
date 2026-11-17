import "./RobotLoader.css";

/* Floating CSS robot (hovering, blinking, eyes following the cursor). Set its size through the
   --rb-size custom property (its font-size, 12px by default; the robot is 16 × 21 of those). */
const RobotLoader = ({ className = "" }: { className?: string }) => (
  <div className={`robot-loader ${className}`} aria-hidden="true">
    <div className="rb-aura" />
    <div className="rb-shadow" />
    <i className="rb-zone rb-zone--tl" />
    <i className="rb-zone rb-zone--t" />
    <i className="rb-zone rb-zone--tr" />
    <i className="rb-zone rb-zone--l" />
    <i className="rb-zone rb-zone--c" />
    <i className="rb-zone rb-zone--r" />
    <i className="rb-zone rb-zone--bl" />
    <i className="rb-zone rb-zone--b" />
    <i className="rb-zone rb-zone--br" />
    <div className="rb-bot">
      <div className="rb-thruster-group">
        <div className="rb-flame" />
        <div className="rb-flame rb-flame--inner" />
        <div className="rb-thruster" />
      </div>
      <div className="rb-body">
        <i className="rb-chest" />
        <i className="rb-core" />
      </div>
      <i className="rb-neck" />
      <div className="rb-head">
        <i className="rb-antenna">
          <i className="rb-beacon">
            <i className="rb-signal rb-signal--1" />
            <i className="rb-signal rb-signal--2" />
            <i className="rb-ball" />
          </i>
        </i>
        <i className="rb-dome" />
        <i className="rb-ear rb-ear--l" />
        <i className="rb-ear rb-ear--r" />
        <div className="rb-face">
          <div className="rb-gaze">
            <i className="rb-eye rb-eye--l" />
            <i className="rb-eye rb-eye--r" />
            <i className="rb-mouth" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default RobotLoader;
