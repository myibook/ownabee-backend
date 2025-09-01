import { prisma } from "./prisma";

const seed = async () => {
  const book = await prisma.audioBook.create({
    data: {
      title: 'Test Book',
      editions: {
        create: {
          pageTexts: {
            createMany: {
              data: [
                {
                  order: 1,
                  originalText: "In the heart of whispering woods, Little Luna the Fox cub hopped from mossy stone to fern fringe log, her bright eyes dancing with curiosity.",
                  grammarCorrectedText: "",
                  grammarChecked: false,
                },
                {
                  order: 2,
                  originalText: "She paused when she heard a soft peep and discovered a tiny mouse caught in a tangle of fallen branches.",
                  grammarCorrectedText: "",
                  grammarChecked: false,
                },
                {
                  order: 3,
                  originalText: "With gentle paws, Luna carefully nudged the twigs away until the mouse was free.",
                  grammarCorrectedText: "",
                  grammarChecked: false,
                },
                {
                  order: 4,
                  originalText: "It's whiskers twitching in gratitude. Together they scurried through the dappled sunlight, sharing tales of secret tunnels and hidden berry patches, their laughter echoing through the trees like a sweet cheerful song.",
                  grammarCorrectedText: "",
                  grammarChecked: false,
                },
                {
                  order: 5,
                  originalText: "In the heart of whispering woods, Little Luna the Fox cub hopped from mossy stone to fern fringe log, her bright eyes dancing with curiosity.",
                  grammarCorrectedText: "",
                  grammarChecked: false,
                },
              ],
            },
          },
        },
      },
    },
    include: {
      editions: {
        include: { pageTexts: true },
      },
    },
  });

  // 4. create pages with layouts
  const edition = book.editions[0];
  const pageTexts = edition.pageTexts;

  await prisma.audioBookPage.createMany({
    data: [
      {
        audioBookEditionId: edition.id,
        order: 1,
        layout: [
          {
            id: "e548faf1-1412-4755-84d8-e22ef35771d4",
            order: pageTexts[0].order,
            originalTextId: pageTexts[0].id,
            content: pageTexts[0].originalText,
            type: "text",
            x: 0.05,
            y: 0.1,
            width: 0.4,
            height: 0.15,
            originalWidth: 0.4,
            baseFontSize: 16,
            minFontSize: 10,
          },
          {
            id: "86f572b8-8674-4696-8ffa-f22fda0eadsg",
            type: "image",
            linkedTextId: "e548faf1-1412-4755-84d8-e22ef35771d4",
            x: 0.50,
            y: 0.1,
            width: 0.4,
            aspectRatio: 1.777777778,
          },
          {
            id: "86f572b8-8674-4696-8ffa-f22fda0e92e8",
            order: pageTexts[1].order,
            originalTextId: pageTexts[1].id,
            content: pageTexts[1].originalText,
            type: "text",
            x: 0.05,
            y: 0.35,
            width: 0.45,
            height: 0.12,
            originalWidth: 0.45,
            baseFontSize: 16,
            minFontSize: 10,
          },
          {
            id: "86f572b8-8674-4696-8ffa-4f3cba6e0g2n",
            type: "image",
            linkedTextId: "86f572b8-8674-4696-8ffa-f22fda0e92e8",
            x: 0.05,
            y: 0.35,
            width: 0.40,
            aspectRatio: 1,
          },
          {
            id: "29903985-d6c1-4d2e-8282-4f3cba6ee4ee",
            order: pageTexts[2].order,
            originalTextId: pageTexts[2].id,
            content: pageTexts[2].originalText,
            type: "text",
            x: 0.05,
            y: 0.7,
            width: 0.9,
            height: 0.15,
            originalWidth: 0.9,
            baseFontSize: 18,
            minFontSize: 12,
          },
        ],
      },
      {
        audioBookEditionId: edition.id,
        order: 2,
        layout: [
          {
            id: "3651fc68-a27d-4a3b-a54c-c35c028a5928",
            order: pageTexts[3].order,
            originalTextId: pageTexts[3].id,
            content: pageTexts[3].originalText,
            type: "text",
            x: 0.05,
            y: 0.1,
            width: 0.4,
            height: 0.15,
            originalWidth: 0.4,
            baseFontSize: 16,
            minFontSize: 10,
          },
          {
            id: "86f572b8-8674-4696-8ffa-bc43b5j33r75",
            type: "image",
            linkedTextId: "3651fc68-a27d-4a3b-a54c-c35c028a5928",
            x: 0.50,
            y: 0.1,
            width: 0.40,
            aspectRatio: 1,
          },
          {
            id: "24c71465-498d-4e91-bffd-bc43b5c13471",
            order: pageTexts[4].order,
            originalTextId: pageTexts[4].id,
            content: pageTexts[4].originalText,
            type: "text",
            x: 0.05,
            y: 0.7,
            width: 0.9,
            height: 0.15,
            originalWidth: 0.9,
            baseFontSize: 18,
            minFontSize: 12,
          },
        ],
      },
    ]
  });

  await prisma.ttsVoice.createMany({
    data: [
      {
        modelId: "3a51c0a4-3cd5-4cba-9638-6a35a8a4831c",
        modelName: "Clyde",
        displayName: "Clyde",
        status: "COMPLETE",
        displayImage: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/60ef75183238775.653bca7072e3a.png",
        createdAt: "2025-01-01T00:00:00.000Z",
      },
      {
        modelId: "300ad1a4-592b-48b5-af7e-07088f37eb8d",
        modelName: "Laura",
        displayName: "Laura",
        status: "COMPLETE",
        displayImage: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/927453183238775.653bca7066c18.png",
        createdAt: "2025-01-01T00:00:00.000Z",
      },
      {
        modelId: "df731b36-ed6a-439b-b1b1-12ec0b17988e",
        modelName: "George",
        displayName: "George",
        status: "COMPLETE",
        displayImage: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/df6bd7183238775.653bca7067fcc.png",
        createdAt: "2025-01-01T00:00:00.000Z",
      },
      {
        modelId: "829fbffe-6f24-438b-a51c-868226f0294f",
        modelName: "Alice",
        displayName: "Alice",
        status: "COMPLETE",
        displayImage: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/e94147183238775.653bca706b68f.png",
        createdAt: "2025-01-01T00:00:00.000Z",
      },
      {
        modelId: "a4af2305-f588-4020-bf03-36da3fbc019a",
        modelName: "girl's voice",
        displayName: "girl's voice",
        status: "COMPLETE",
        displayColor: "#FF82EA",
      },
    ],
  });
};

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
