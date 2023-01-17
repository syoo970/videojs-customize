import React, { useState } from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import Video from "@/components/Video";

export default {
  title: "video/player",
  component: Video,
  argTypes: {
    src: {
      control: "select",
      options: ["starwars", "city", "beach"],
    },
  },
  args: {
    sources: [{ src: "/starwars.mp4", type: "video/mp4" }],
    styles: {
      width: "500px",
      aspectRatio: "16 / 9",
    },
    videoOptions: {
      controls: true,
      autoplay: true,
    },
  },
} as ComponentMeta<typeof Video>;

const Template: ComponentStory<typeof Video> = (args) => {
  const { sources } = args;
  const [videoSource, setVideoSource] = useState(
    sources ?? [{ src: "/starwars.mp4", type: "video/mp4" }]
  );

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setVideoSource([{ src: `/${value}.mp4`, type: "video/mp4" }]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Video {...args} sources={videoSource} />
      <div>
        <select onChange={handleSelectChange}>
          <option value="starwars">Starwars</option>
          <option value="city">City</option>
          <option value="beach">Beach</option>
        </select>
      </div>
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {};
