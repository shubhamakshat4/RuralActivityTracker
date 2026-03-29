import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

const ffmpeg = new FFmpeg();

export const compressVideo = async (file) => {

  const MAX_SIZE = 100 * 1024 * 1024;

  if (file.size > MAX_SIZE) {

    throw new Error("Video exceeds 100MB limit");

  }

  if (!ffmpeg.loaded) {

    await ffmpeg.load();

  }


  /* write file */

  await ffmpeg.writeFile(

    "input.mp4",

    await fetchFile(file)

  );


  /* compress */

  await ffmpeg.exec([

    "-i",

    "input.mp4",

    "-vf",

    "scale=1280:-2",

    "-b:v",

    "1000k",

    "output.mp4"

  ]);


  /* read file */

  const data = await ffmpeg.readFile(

    "output.mp4"

  );


  return new File(

    [data],

    "compressed.mp4",

    {

      type: "video/mp4"

    }

  );

};
