import React from "react";

interface TimelineProps {
  title: string;
  time: string;
  Location: string;
}

const TimelineItem = ({
  title,
  time: subtitle,
  Location: des,
}: TimelineProps) => {
  return (
    <li>
      <div className="right_content">
        <h2 className="text-[#a13bf7] dark:text-[#2fceff]">{title}</h2>
        <a
          href={des}
          target="_blank"
          rel="noreferrer"
          className="text-gray-700 dark:text-white"
        >
          Location
        </a>
      </div>
      <div className="left_content">
        <h3 className="text-gray-700 dark:text-white">{subtitle}</h3>
      </div>
    </li>
  );
};

const Timeline = ({ points }: any) => {
  const pointers = points
    ? points.map(({ title, Location: des, time: subtitle }: TimelineProps) => (
        <TimelineItem
          key={title}
          title={title}
          Location={des}
          time={subtitle}
        />
      ))
    : "";

  return (
    <div className="timeline">
      <ul>
        {pointers}
        <div style={{ clear: "both" }}></div>
      </ul>
    </div>
  );
};

export default Timeline;
