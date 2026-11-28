window.PROJECT = {
  "name": "Elucidating the Design Space of End-to-end Latent Representation Learning in World Action Models",
  "title": "Elucidating the Design Space of End-to-end Latent Representation Learning in World Action Models",
  "authors": [
    {
      "name": "Junming Zhao",
      "marker": "*",
      "url": "https://junmingzhao20.github.io/"
    },
    {
      "name": "Shi Sheng",
      "marker": "*",
      "url": "https://mikuase-shi.github.io"
    },
    {
      "name": "Jiacheng You",
      "url": "https://github.com/YouJiacheng"
    },
    {
      "name": "Chenxi Li",
      "url": "https://chx-li.github.io/"
    },
    {
      "name": "Bowen Hu",
      "url": "https://github.com/IamHBW"
    },
    {
      "name": "Chengbo Yuan",
      "url": "https://michaelyuancb.github.io/"
    },
    {
      "name": "Yingdong Hu",
      "url": "https://yingdong-hu.github.io/"
    },
    {
      "name": "Weirui Ye",
      "url": "https://yewr.github.io/"
    },
    {
      "name": "Yang Gao",
      "marker": "†",
      "url": "https://yang-gao.weebly.com/"
    }
  ],
  "affiliations": [],
  "note": "* Equal contribution. † Corresponding author.",
  "resources": [
    {
      "label": "Paper",
      "url": null
    },
    {
      "label": "Code",
      "url": null
    },
    {
      "label": "Models",
      "url": null
    }
  ],
  "hero": {
    "video": "media/hero/long-horizon-faucet.mp4",
    "poster": "media/hero/long-horizon-faucet.jpg"
  },
  "tasks": [
    {
      "id": "cloth-sceneOOD",
      "title": "Clothes Folding",
      "short": "Clothes Folding",
      "category": "Deformable objects",
      "description": "Folding a shirt on the tabletop.",
      "condition": "sceneOOD",
      "model": "lwm",
      "label": "success",
      "treatment": "brightened",
      "view": "top",
      "video": "media/curated_eval_videos_20261020/cloth/lwm/sceneOOD/success__11of20__brightened/top.mp4",
      "heroVideo": "media/hero/cloth-sceneOOD.mp4",
      "poster": "assets/cloth-sceneOOD.jpg"
    },
    {
      "id": "fridge-indomain",
      "title": "Iced Tea Making",
      "short": "Iced Tea Making",
      "category": "Multi-stage manipulation",
      "description": "A kitchen workspace with a fridge, spoon, kettle, tap, and cup.",
      "condition": "indomain",
      "model": "lwm",
      "label": "success",
      "treatment": "brightened",
      "view": "top",
      "video": "media/curated_eval_videos_20261020/fridge/lwm/indomain/success__02of20__brightened/top.mp4",
      "heroVideo": "media/hero/fridge-indomain.mp4",
      "poster": "assets/fridge-indomain.jpg"
    },
    {
      "id": "fridge-textureOOD",
      "title": "Iced Tea Making",
      "short": "Iced Tea Making",
      "category": "Multi-stage manipulation",
      "description": "A kitchen workspace with a fridge, spoon, kettle, tap, and cup.",
      "condition": "textureOOD",
      "model": "lwm",
      "label": "success",
      "treatment": "brightened",
      "view": "top",
      "video": "media/curated_eval_videos_20261020/fridge/lwm/textureOOD/success__04of20__brightened/top.mp4",
      "heroVideo": "media/hero/fridge-textureOOD.mp4",
      "poster": "assets/fridge-textureOOD.jpg"
    },
    {
      "id": "cloth-backgroundobjOOD",
      "title": "Clothes Folding",
      "short": "Clothes Folding",
      "category": "Deformable objects",
      "description": "Folding a shirt on the tabletop.",
      "condition": "background-object OOD",
      "model": "lwm",
      "label": "success",
      "treatment": "original",
      "view": "top",
      "video": "media/curated_eval_videos_20261020/cloth/lwm/backgroundobjOOD/success__18of20__original/top.mp4",
      "heroVideo": "media/hero/cloth-backgroundobjOOD.mp4",
      "poster": "assets/cloth-backgroundobjOOD.jpg",
      "displayTreatment": "whiteboard-highlights"
    },
    {
      "id": "usbcharger-indomain",
      "title": "USB Insertion",
      "short": "USB Insertion",
      "category": "Fine manipulation",
      "description": "A charger and power strip insertion task.",
      "condition": "indomain",
      "model": "lwm",
      "label": "success",
      "treatment": "brightened",
      "view": "top",
      "video": "media/curated_eval_videos_20261020/usbcharger/lwm/indomain/success__01of20__brightened/top.mp4",
      "heroVideo": "media/hero/usbcharger-indomain.mp4",
      "poster": "assets/usbcharger-indomain.jpg"
    },
    {
      "id": "usbcharger-objectOOD",
      "title": "USB Insertion",
      "short": "USB Insertion",
      "category": "Fine manipulation",
      "description": "A charger and power strip insertion task.",
      "condition": "objectOOD",
      "model": "lwm",
      "label": "success",
      "treatment": "brightened",
      "view": "top",
      "video": "media/curated_eval_videos_20261020/usbcharger/lwm/objectOOD/fail__01of20__brightened/top.mp4",
      "heroVideo": "media/hero/usbcharger-objectOOD.mp4",
      "poster": "assets/rollouts/usbcharger-objectood-lwm-success.jpg"
    },
    {
      "id": "ring-indomain",
      "title": "Rotating Hanoi Stacking",
      "short": "Rotating Hanoi Stacking",
      "category": "Contact-rich manipulation",
      "description": "Manipulating a ring around a wooden box and rotating pillar.",
      "condition": "indomain",
      "model": "lwm",
      "label": "success",
      "treatment": "brightened",
      "view": "top",
      "video": "media/curated_eval_videos_20261020/ring/lwm/indomain/success__01of20__brightened/top.mp4",
      "heroVideo": "media/hero/ring-indomain.mp4",
      "poster": "assets/ring-indomain.jpg"
    },
    {
      "id": "ring-velOOD",
      "title": "Rotating Hanoi Stacking",
      "short": "Rotating Hanoi Stacking",
      "category": "Contact-rich manipulation",
      "description": "Manipulating a ring around a wooden box and rotating pillar.",
      "condition": "velOOD",
      "model": "lwm",
      "label": "success",
      "treatment": "brightened",
      "view": "top",
      "video": "media/curated_eval_videos_20261020/ring/lwm/velOOD/success__03of20__brightened/top.mp4",
      "heroVideo": "media/hero/ring-velOOD.mp4",
      "poster": "assets/ring-velOOD.jpg"
    },
    {
      "id": "pi05-usbcharger-indomain",
      "title": "USB Insertion",
      "short": "USB Insertion",
      "category": "Fine manipulation",
      "description": "A charger and power strip insertion task.",
      "condition": "indomain",
      "model": "pi05",
      "label": "success",
      "treatment": "brightened",
      "view": "top",
      "video": "media/curated_eval_videos_20261020/usbcharger/pi05/indomain/success__21of30__brightened/top.mp4",
      "heroVideo": "media/hero/pi05-usbcharger-indomain.mp4",
      "poster": "assets/rollouts/usbcharger-indomain-pi05-success.jpg"
    },
    {
      "id": "identifytable-indomain",
      "title": "Waste Sorting",
      "short": "Waste Sorting",
      "category": "Object interaction",
      "description": "Identifying and sorting objects across a tabletop workspace.",
      "condition": "indomain",
      "model": "lwm",
      "label": "success",
      "treatment": "brightened",
      "view": "top",
      "video": "media/curated_eval_videos_20261020/identifytable/lwm/indomain/success__01of20__brightened/top.mp4",
      "heroVideo": "media/hero/identifytable-indomain.mp4",
      "poster": "assets/identifytable-indomain.jpg"
    },
    {
      "id": "identifytable-objectOOD",
      "title": "Waste Sorting",
      "short": "Waste Sorting",
      "category": "Object interaction",
      "description": "Identifying and sorting objects across a tabletop workspace.",
      "condition": "objectOOD",
      "model": "lwm",
      "label": "success",
      "treatment": "brightened",
      "view": "top",
      "video": "media/curated_eval_videos_20261020/identifytable/lwm/objectOOD/success__19of20__brightened/top.mp4",
      "heroVideo": "media/hero/identifytable-objectOOD.mp4",
      "poster": "assets/identifytable-objectOOD.jpg"
    },
    {
      "id": "pi05-ring-velOOD",
      "title": "Rotating Hanoi Stacking",
      "short": "Rotating Hanoi Stacking",
      "category": "Contact-rich manipulation",
      "description": "Manipulating a ring around a wooden box and rotating pillar.",
      "condition": "velOOD",
      "model": "pi05",
      "label": "success",
      "treatment": "brightened",
      "view": "top",
      "video": "media/curated_eval_videos_20261020/ring/pi05/velOOD/success__02of20__brightened/top.mp4",
      "heroVideo": "media/hero/pi05-ring-velOOD.mp4",
      "poster": "assets/rollouts/ring-velood-pi05-success.jpg"
    }
  ],
  "simulationResults": [
    {
      "name": "RoboTwin 2.0",
      "scores": [
        {
          "train": "Clean",
          "evaluation": "Clean",
          "label": "In-distribution",
          "value": "83.06"
        },
        {
          "train": "Clean",
          "evaluation": "Random",
          "label": "Generalization",
          "value": "56.78"
        }
      ]
    },
    {
      "name": "LIBERO",
      "scores": [
        {
          "train": "Original",
          "evaluation": "Original",
          "label": "In-distribution",
          "value": "98.35"
        },
        {
          "train": "Original",
          "evaluation": "LIBERO-Plus",
          "label": "Generalization",
          "value": "84.46"
        }
      ]
    }
  ],
  "titleLines": [
    "Elucidating the Design Space of",
    "End-to-end Latent Representation Learning",
    "in World Action Models"
  ]
};
