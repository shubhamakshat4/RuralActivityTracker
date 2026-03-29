export const compressImage = (file) => {

  return new Promise((resolve, reject) => {

    const MAX_SIZE = 50 * 1024 * 1024;

    if (file.size > MAX_SIZE) {

      reject(
        new Error("Image exceeds 50MB limit")
      );

      return;

    }

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = (event) => {

      const img = new Image();

      img.src = event.target.result;

      img.onload = () => {

        const canvas =
          document.createElement("canvas");

        const MAX_WIDTH = 1600;

        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {

          height =
            height *
            (MAX_WIDTH / width);

          width = MAX_WIDTH;

        }

        canvas.width = width;
        canvas.height = height;

        const ctx =
          canvas.getContext("2d");

        ctx.drawImage(
          img,
          0,
          0,
          width,
          height
        );

        canvas.toBlob(

          (blob) => {

            resolve(

              new File(

                [blob],

                file.name,

                {

                  type:
                    "image/jpeg",

                  lastModified:
                    Date.now()

                }

              )

            );

          },

          "image/jpeg",

          0.7

        );

      };

    };

  });

};
