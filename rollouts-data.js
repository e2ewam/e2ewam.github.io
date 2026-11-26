window.ROLLOUTS = {
  "models": [
    {
      "id": "lwm",
      "label": "E2EWAM",
      "outcome": "success"
    },
    {
      "id": "openwam",
      "label": "OpenWAM-α",
      "outcome": "fail"
    },
    {
      "id": "pi05",
      "label": "π₀.₅",
      "outcome": "fail"
    }
  ],
  "defaultTask": "fridge",
  "tasks": [
    {
      "id": "fridge",
      "label": "Iced Tea Making",
      "defaultView": "top",
      "conditions": [
        {
          "id": "indomain",
          "label": "In-distribution"
        },
        {
          "id": "textureOOD",
          "label": "Background shift"
        }
      ]
    },
    {
      "id": "cloth",
      "label": "Clothes Folding",
      "defaultView": "top",
      "conditions": [
        {
          "id": "indomain",
          "label": "In-distribution"
        },
        {
          "id": "objectOOD",
          "label": "Object shift"
        },
        {
          "id": "sceneOOD",
          "label": "Background shift"
        },
        {
          "id": "background-object OOD",
          "label": "Object + background shift"
        }
      ]
    },
    {
      "id": "identifytable",
      "label": "Waste Sorting",
      "defaultView": "top",
      "conditions": [
        {
          "id": "indomain",
          "label": "In-distribution"
        },
        {
          "id": "objectOOD",
          "label": "Object shift"
        }
      ]
    },
    {
      "id": "ring",
      "label": "Rotating Hanoi Stacking",
      "defaultView": "top",
      "conditions": [
        {
          "id": "indomain",
          "label": "In-distribution"
        },
        {
          "id": "velOOD",
          "label": "Velocity shift"
        }
      ]
    },
    {
      "id": "usbcharger",
      "label": "USB Insertion",
      "defaultView": "right",
      "conditions": [
        {
          "id": "indomain",
          "label": "In-distribution"
        },
        {
          "id": "objectOOD",
          "label": "Object shift"
        }
      ]
    }
  ],
  "episodes": [
    {
      "task": "fridge",
      "condition": "indomain",
      "model": "lwm",
      "outcome": "success",
      "episodeIndex": 2,
      "views": {
        "top": "media/curated_eval_videos_20261020/fridge/lwm/indomain/success__02of20__brightened/top.mp4"
      },
      "posters": {
        "top": "assets/rollouts/fridge-indomain-lwm-success.jpg"
      },
      "speed": [
        [
          74,
          86,
          3
        ]
      ]
    },
    {
      "task": "fridge",
      "condition": "indomain",
      "model": "openwam",
      "outcome": "fail",
      "episodeIndex": 11,
      "views": {
        "top": "media/curated_eval_videos_20261020/fridge/openwam/indomain/fail__11of20__brightened/top.mp4"
      },
      "posters": {
        "top": "assets/rollouts/fridge-indomain-openwam-fail.jpg"
      },
      "speed": [
        [
          0,
          5.5,
          2
        ],
        [
          16,
          23,
          2
        ],
        [
          39,
          48,
          3
        ]
      ]
    },
    {
      "task": "fridge",
      "condition": "indomain",
      "model": "pi05",
      "outcome": "fail",
      "episodeIndex": 1,
      "views": {
        "top": "media/curated_eval_videos_20261020/fridge/pi05/indomain/fail__01of20__brightened/top.mp4"
      },
      "posters": {
        "top": "assets/rollouts/fridge-indomain-pi05-fail.jpg"
      },
      "speed": [
        [
          0,
          3,
          2
        ],
        [
          33,
          41.5,
          3
        ]
      ]
    },
    {
      "task": "fridge",
      "condition": "textureOOD",
      "model": "lwm",
      "outcome": "success",
      "episodeIndex": 4,
      "views": {
        "top": "media/curated_eval_videos_20261020/fridge/lwm/textureOOD/success__04of20__brightened/top.mp4"
      },
      "posters": {
        "top": "assets/rollouts/fridge-textureood-lwm-success.jpg"
      },
      "speed": [
        [
          90,
          92,
          2
        ],
        [
          95.5,
          99.5,
          2
        ]
      ]
    },
    {
      "task": "fridge",
      "condition": "textureOOD",
      "model": "openwam",
      "outcome": "fail",
      "episodeIndex": 11,
      "views": {
        "top": "media/curated_eval_videos_20261020/fridge/openwam/textureOOD/fail__11of20__brightened/top.mp4"
      },
      "posters": {
        "top": "assets/rollouts/fridge-textureood-openwam-fail.jpg"
      },
      "speed": [
        [
          0,
          5,
          2
        ]
      ]
    },
    {
      "task": "fridge",
      "condition": "textureOOD",
      "model": "pi05",
      "outcome": "fail",
      "episodeIndex": 11,
      "views": {
        "top": "media/curated_eval_videos_20261020/fridge/pi05/textureOOD/fail__11of20__brightened/top.mp4"
      },
      "posters": {
        "top": "assets/rollouts/fridge-textureood-pi05-fail.jpg"
      },
      "speed": [
        [
          0,
          4,
          2
        ]
      ]
    },
    {
      "task": "cloth",
      "condition": "indomain",
      "model": "lwm",
      "outcome": "success",
      "episodeIndex": 1,
      "views": {
        "top": "media/curated_eval_videos_20261020/cloth/lwm/indomain/success__01of20__brightened/top.mp4"
      },
      "posters": {
        "top": "assets/rollouts/cloth-indomain-lwm-success.jpg"
      },
      "speed": [
        [
          0,
          2.8,
          2
        ]
      ]
    },
    {
      "task": "cloth",
      "condition": "indomain",
      "model": "openwam",
      "outcome": "fail",
      "episodeIndex": 14,
      "views": {
        "top": "media/curated_eval_videos_20261020/cloth/openwam/indomain/fail__14of20__brightened/top.mp4"
      },
      "posters": {
        "top": "assets/rollouts/cloth-indomain-openwam-fail.jpg"
      },
      "speed": [
        [
          0,
          2.7,
          2
        ]
      ]
    },
    {
      "task": "cloth",
      "condition": "indomain",
      "model": "pi05",
      "outcome": "fail",
      "episodeIndex": 14,
      "views": {
        "top": "media/curated_eval_videos_20261020/cloth/pi05/indomain/fail__14of20__brightened/top.mp4"
      },
      "posters": {
        "top": "assets/rollouts/cloth-indomain-pi05-fail.jpg"
      },
      "speed": [
        [
          0,
          2.7,
          2
        ]
      ]
    },
    {
      "task": "cloth",
      "condition": "objectOOD",
      "model": "lwm",
      "outcome": "success",
      "episodeIndex": 5,
      "views": {
        "top": "media/curated_eval_videos_20261020/cloth/lwm/objectOOD/success__05of20__brightened/top.mp4"
      },
      "posters": {
        "top": "assets/rollouts/cloth-objectood-lwm-success.jpg"
      },
      "speed": [
        [
          0,
          2.8,
          2
        ]
      ]
    },
    {
      "task": "cloth",
      "condition": "objectOOD",
      "model": "openwam",
      "outcome": "fail",
      "episodeIndex": 18,
      "views": {
        "top": "media/curated_eval_videos_20261020/cloth/openwam/objectOOD/fail__18of20__brightened/top.mp4"
      },
      "posters": {
        "top": "assets/rollouts/cloth-objectood-openwam-fail.jpg"
      },
      "speed": [
        [
          0,
          2.6,
          2
        ]
      ]
    },
    {
      "task": "cloth",
      "condition": "objectOOD",
      "model": "pi05",
      "outcome": "fail",
      "episodeIndex": 1,
      "views": {
        "top": "media/curated_eval_videos_20261020/cloth/pi05/objectOOD/fail__01of20__brightened/top.mp4"
      },
      "posters": {
        "top": "assets/rollouts/cloth-objectood-pi05-fail.jpg"
      },
      "speed": [
        [
          0,
          2.8,
          2
        ]
      ]
    },
    {
      "task": "cloth",
      "condition": "sceneOOD",
      "model": "lwm",
      "outcome": "success",
      "episodeIndex": 11,
      "views": {
        "top": "media/curated_eval_videos_20261020/cloth/lwm/sceneOOD/success__11of20__brightened/top.mp4"
      },
      "posters": {
        "top": "assets/rollouts/cloth-sceneood-lwm-success.jpg"
      },
      "speed": [
        [
          0,
          2.8,
          2
        ]
      ]
    },
    {
      "task": "cloth",
      "condition": "sceneOOD",
      "model": "openwam",
      "outcome": "fail",
      "episodeIndex": 10,
      "views": {
        "top": "media/curated_eval_videos_20261020/cloth/openwam/sceneOOD/fail__10of20__original/top.mp4"
      },
      "posters": {
        "top": "assets/rollouts/cloth-sceneood-openwam-fail.jpg"
      },
      "speed": [
        [
          0,
          2.8,
          2
        ]
      ]
    },
    {
      "task": "cloth",
      "condition": "sceneOOD",
      "model": "pi05",
      "outcome": "fail",
      "episodeIndex": 10,
      "views": {
        "top": "media/curated_eval_videos_20261020/cloth/pi05/sceneOOD/fail__10of20__original/top.mp4"
      },
      "posters": {
        "top": "assets/rollouts/cloth-sceneood-pi05-fail.jpg"
      },
      "speed": [
        [
          0,
          2.8,
          2
        ]
      ]
    },
    {
      "task": "cloth",
      "condition": "background-object OOD",
      "model": "lwm",
      "outcome": "success",
      "episodeIndex": 18,
      "views": {
        "top": "media/curated_eval_videos_20261020/cloth/lwm/backgroundobjOOD/success__18of20__original/top.mp4"
      },
      "posters": {
        "top": "assets/rollouts/cloth-background-object-ood-lwm-success.jpg"
      },
      "speed": [
        [
          0,
          2.8,
          2
        ]
      ]
    },
    {
      "task": "cloth",
      "condition": "background-object OOD",
      "model": "openwam",
      "outcome": "fail",
      "episodeIndex": 1,
      "views": {
        "top": "media/curated_eval_videos_20261020/cloth/openwam/backgroundobjOOD/fail__01of20__brightened/top.mp4"
      },
      "posters": {
        "top": "assets/rollouts/cloth-background-object-ood-openwam-fail.jpg"
      },
      "speed": [
        [
          0,
          2.6,
          2
        ]
      ]
    },
    {
      "task": "cloth",
      "condition": "background-object OOD",
      "model": "pi05",
      "outcome": "fail",
      "episodeIndex": 9,
      "views": {
        "top": "media/curated_eval_videos_20261020/cloth/pi05/backgroundobjOOD/fail__09of20__brightened/top.mp4"
      },
      "posters": {
        "top": "assets/rollouts/cloth-background-object-ood-pi05-fail.jpg"
      },
      "speed": [
        [
          0,
          2.8,
          2
        ]
      ]
    },
    {
      "task": "identifytable",
      "condition": "indomain",
      "model": "lwm",
      "outcome": "success",
      "episodeIndex": 1,
      "views": {
        "top": "media/curated_eval_videos_20261020/identifytable/lwm/indomain/success__01of20__brightened/top.mp4"
      },
      "posters": {
        "top": "assets/rollouts/identifytable-indomain-lwm-success.jpg"
      },
      "speed": [
        [
          0,
          3,
          2
        ],
        [
          24,
          28,
          2
        ]
      ]
    },
    {
      "task": "identifytable",
      "condition": "indomain",
      "model": "openwam",
      "outcome": "fail",
      "episodeIndex": 2,
      "views": {
        "top": "media/curated_eval_videos_20261020/identifytable/openwam/indomain/fail__02of20__brightened/top.mp4"
      },
      "posters": {
        "top": "assets/rollouts/identifytable-indomain-openwam-fail.jpg"
      },
      "speed": [
        [
          0,
          2.5,
          2
        ],
        [
          31,
          38,
          2
        ],
        [
          59,
          64,
          2
        ]
      ]
    },
    {
      "task": "identifytable",
      "condition": "indomain",
      "model": "pi05",
      "outcome": "fail",
      "episodeIndex": 6,
      "views": {
        "top": "media/curated_eval_videos_20261020/identifytable/pi05/indomain/fail__06of21__brightened/top.mp4"
      },
      "posters": {
        "top": "assets/rollouts/identifytable-indomain-pi05-fail.jpg"
      },
      "speed": [
        [
          0,
          2,
          2
        ],
        [
          11,
          17.8,
          3
        ]
      ]
    },
    {
      "task": "identifytable",
      "condition": "objectOOD",
      "model": "lwm",
      "outcome": "success",
      "episodeIndex": 19,
      "views": {
        "top": "media/curated_eval_videos_20261020/identifytable/lwm/objectOOD/success__19of20__brightened/top.mp4"
      },
      "posters": {
        "top": "assets/rollouts/identifytable-objectood-lwm-success.jpg"
      },
      "speed": [
        [
          0,
          2.8,
          2
        ],
        [
          24.6,
          29,
          2
        ]
      ]
    },
    {
      "task": "identifytable",
      "condition": "objectOOD",
      "model": "openwam",
      "outcome": "fail",
      "episodeIndex": 20,
      "views": {
        "top": "media/curated_eval_videos_20261020/identifytable/openwam/objectOOD/fail__20of20__brightened/top.mp4"
      },
      "posters": {
        "top": "assets/rollouts/identifytable-objectood-openwam-fail.jpg"
      },
      "speed": [
        [
          0,
          2.5,
          2
        ],
        [
          11,
          14.5,
          2
        ],
        [
          30.5,
          33.8,
          2
        ]
      ]
    },
    {
      "task": "identifytable",
      "condition": "objectOOD",
      "model": "pi05",
      "outcome": "fail",
      "episodeIndex": 1,
      "views": {
        "top": "media/curated_eval_videos_20261020/identifytable/pi05/objectOOD/fail__01of20__brightened/top.mp4"
      },
      "posters": {
        "top": "assets/rollouts/identifytable-objectood-pi05-fail.jpg"
      },
      "speed": [
        [
          0,
          2,
          2
        ],
        [
          29,
          41,
          3
        ],
        [
          43.9,
          47,
          2
        ]
      ]
    },
    {
      "task": "ring",
      "condition": "indomain",
      "model": "lwm",
      "outcome": "success",
      "episodeIndex": 1,
      "views": {
        "top": "media/curated_eval_videos_20261020/ring/lwm/indomain/success__01of20__brightened/top.mp4"
      },
      "posters": {
        "top": "assets/rollouts/ring-indomain-lwm-success.jpg"
      },
      "speed": [
        [
          0,
          4.5,
          2
        ],
        [
          19,
          62.5,
          3
        ]
      ]
    },
    {
      "task": "ring",
      "condition": "indomain",
      "model": "openwam",
      "outcome": "fail",
      "episodeIndex": 13,
      "views": {
        "top": "media/curated_eval_videos_20261020/ring/openwam/indomain/fail__13of20__brightened/top.mp4"
      },
      "posters": {
        "top": "assets/rollouts/ring-indomain-openwam-fail.jpg"
      },
      "speed": [
        [
          0,
          4,
          2
        ],
        [
          18,
          37,
          2
        ]
      ]
    },
    {
      "task": "ring",
      "condition": "indomain",
      "model": "pi05",
      "outcome": "fail",
      "episodeIndex": 11,
      "views": {
        "top": "media/curated_eval_videos_20261020/ring/pi05/indomain/fail__11of20__brightened/top.mp4"
      },
      "posters": {
        "top": "assets/rollouts/ring-indomain-pi05-fail.jpg"
      },
      "speed": [
        [
          0,
          3.5,
          2
        ],
        [
          22,
          34,
          3
        ],
        [
          44,
          57,
          2
        ]
      ]
    },
    {
      "task": "ring",
      "condition": "velOOD",
      "model": "lwm",
      "outcome": "success",
      "episodeIndex": 17,
      "views": {
        "top": "media/rollout-clips/ring-velocity-e2ewam-17/top.mp4"
      },
      "posters": {
        "top": "assets/rollouts/ring-velood-lwm-featured-top.jpg"
      },
      "speed": [
        [
          0,
          3.5,
          2
        ]
      ]
    },
    {
      "task": "ring",
      "condition": "velOOD",
      "model": "openwam",
      "outcome": "fail",
      "episodeIndex": 12,
      "views": {
        "top": "media/curated_eval_videos_20261020/ring/openwam/velOOD/fail__12of20__brightened/top.mp4"
      },
      "posters": {
        "top": "assets/rollouts/ring-velood-openwam-fail.jpg"
      },
      "speed": [
        [
          0,
          3,
          2
        ],
        [
          15.6,
          19.5,
          2
        ]
      ]
    },
    {
      "task": "ring",
      "condition": "velOOD",
      "model": "pi05",
      "outcome": "fail",
      "episodeIndex": 20,
      "views": {
        "top": "media/curated_eval_videos_20261020/ring/pi05/velOOD/fail__20of20__brightened/top.mp4"
      },
      "posters": {
        "top": "assets/rollouts/ring-velood-pi05-fail.jpg"
      },
      "speed": [
        [
          0,
          3.5,
          2
        ],
        [
          15,
          28,
          2
        ]
      ]
    },
    {
      "task": "usbcharger",
      "condition": "indomain",
      "model": "lwm",
      "outcome": "success",
      "episodeIndex": 1,
      "views": {
        "right": "media/curated_eval_videos_20261020/usbcharger/lwm/indomain/success__01of20__brightened/right.mp4"
      },
      "posters": {
        "right": "assets/rollouts/usbcharger-indomain-lwm-featured-right.jpg"
      },
      "speed": []
    },
    {
      "task": "usbcharger",
      "condition": "indomain",
      "model": "openwam",
      "outcome": "fail",
      "episodeIndex": 19,
      "views": {
        "right": "media/curated_eval_videos_20261020/usbcharger/openwam/indomain/fail__19of20__brightened/right.mp4"
      },
      "posters": {
        "right": "assets/rollouts/usbcharger-indomain-openwam-featured-right.jpg"
      },
      "speed": []
    },
    {
      "task": "usbcharger",
      "condition": "indomain",
      "model": "pi05",
      "outcome": "fail",
      "episodeIndex": 11,
      "views": {
        "right": "media/curated_eval_videos_20261020/usbcharger/pi05/indomain/fail__11of30__brightened/right.mp4"
      },
      "posters": {
        "right": "assets/rollouts/usbcharger-indomain-pi05-featured-right.jpg"
      },
      "speed": []
    },
    {
      "task": "usbcharger",
      "condition": "objectOOD",
      "model": "lwm",
      "outcome": "success",
      "episodeIndex": 1,
      "views": {
        "right": "media/curated_eval_videos_20261020/usbcharger/lwm/objectOOD/fail__01of20__brightened/right.mp4"
      },
      "posters": {
        "right": "assets/rollouts/usbcharger-objectood-lwm-featured-right.jpg"
      },
      "speed": []
    },
    {
      "task": "usbcharger",
      "condition": "objectOOD",
      "model": "openwam",
      "outcome": "fail",
      "episodeIndex": 4,
      "views": {
        "right": "media/curated_eval_videos_20261020/usbcharger/openwam/objectOOD/fail__04of20__brightened/right.mp4"
      },
      "posters": {
        "right": "assets/rollouts/usbcharger-objectood-openwam-featured-right.jpg"
      },
      "speed": []
    },
    {
      "task": "usbcharger",
      "condition": "objectOOD",
      "model": "pi05",
      "outcome": "fail",
      "episodeIndex": 5,
      "views": {
        "right": "media/curated_eval_videos_20261020/usbcharger/pi05/objectOOD/fail__05of20__brightened/right.mp4"
      },
      "posters": {
        "right": "assets/rollouts/usbcharger-objectood-pi05-featured-right.jpg"
      },
      "speed": []
    }
  ]
};
