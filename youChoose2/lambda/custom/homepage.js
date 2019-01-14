{
    "type": "APL",
    "version": "1.0",
    "theme": "dark",
    "import": [
        {
            "name": "alexa-viewport-profiles",
            "version": "1.0.0"
        }
        ],
    "resources": [
        {
            "colors": {
                "defaultColor": "#0A1EFF"
            }
        }
            ],
    "styles": {},
    "layouts": {},
    "mainTemplate": {
        "items": [
            {
                "type": "Container",
                "width": "100vw",
                "height": "100vh",
                "items": [
                    {
                        "type": "Frame",
                        "width": "100vw",
                        "height": "100vh",
                        "backgroundColor": "#0ADCFF",
                        "item": {
                            "type": "Container",
                            "width": "100vw",
                            "height": "100vh",
                            "items": [
                                {
                                    "when": "${@viewportProfile == @hubLandscapeMedium}",
                                    "type": "Container",
                                    "width": "100vw",
                                    "height": "100vh",
                                    "items": [
                                        {
                                            "type": "Text",
                                            "text": "You Choose",
                                            "color": "#FFFFFF",
                                            "fontSize": "8vw",
                                            "fontWeight": "900",
                                            "position": "absolute",
                                            "left": "30vw",
                                            "top": "20vh"
                                        },
                                        {
                                            "type": "Text",
                                            "text": "Hungry?",
                                            "position": "absolute",
                                            "left": "43vw",
                                            "top": "35vh"
                                        },
                                        {
                                            "type": "Image",
                                            "source": "https://www.dinnertwist.com.au/img/main/brand_logo_dark.png",
                                            "height": 300,
                                            "width": 300,
                                            "position": "absolute",
                                            "top": "43vh",
                                            "left": "35vw"
                                        }
                                    ]
                                },
                                {
                                    "when": "${@viewportProfile == @hubLandscapeLarge}",
                                    "type": "Container",
                                    "width": "100vw",
                                    "height": "100vh",
                                    "items": [
                                        {
                                            "type": "Text",
                                            "text": "You Choose",
                                            "color": "#FFFFFF",
                                            "fontSize": "8vw",
                                            "fontWeight": "900",
                                            "position": "absolute",
                                            "left": "28vw",
                                            "top": "20vh"
                                        },
                                        {
                                            "type": "Text",
                                            "text": "Hungry?",
                                            "fontSize": "4vw",
                                            "position": "absolute",
                                            "left": "43vw",
                                            "top": "35vh"
                                        },
                                        {
                                            "type": "Image",
                                            "source": "https://www.dinnertwist.com.au/img/main/brand_logo_dark.png",
                                            "height": 400,
                                            "width": 400,
                                            "position": "absolute",
                                            "top": "43vh",
                                            "left": "35vw"
                                        }
                                    ]
                                },
                                {
                                    "when": "${@viewportProfile == @hubRoundSmall}",
                                    "type": "Container",
                                    "width": "100vw",
                                    "height": "100vh",
                                    "items": [
                                        {
                                            "type": "Text",
                                            "text": "You Choose",
                                            "color": "#FFFFFF",
                                            "fontSize": "12vw",
                                            "fontWeight": "900",
                                            "position": "absolute",
                                            "left": "19vw",
                                            "top": "13vh"
                                        },
                                        {
                                            "type": "Text",
                                            "text": "Hungry?",
                                            "position": "absolute",
                                            "left": "38vw",
                                            "top": "25vh"
                                        },
                                        {
                                            "type": "Image",
                                            "source": "https://www.dinnertwist.com.au/img/main/brand_logo_dark.png",
                                            "height": 250,
                                            "width": 250,
                                            "position": "absolute",
                                            "top": "35vh",
                                            "left": "25vw"
                                        }
                                    ]
                                },
                                {
                                    "when": "@viewportProfile == @tvLandscapeXLarge}",
                                    "type": "Container",
                                    "width": "100vw",
                                    "height": "100vh",
                                    "items": [
                                        {
                                            "type": "Text",
                                            "text": "You Choose",
                                            "color": "#FFFFFF",
                                            "fontSize": "8vw",
                                            "fontWeight": "900",
                                            "position": "absolute",
                                            "left": "29vw",
                                            "top": "10vh"
                                        },
                                        {
                                            "type": "Text",
                                            "text": "Hungry?",
                                            "position": "absolute",
                                            "left": "42vw",
                                            "top": "25vh"
                                        },
                                        {
                                            "type": "Image",
                                            "source": "https://www.dinnertwist.com.au/img/main/brand_logo_dark.png",
                                            "height": 300,
                                            "width": 300,
                                            "position": "absolute",
                                            "top": "35vh",
                                            "left": "33vw"
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                ]
            }
        ]
    }
}
