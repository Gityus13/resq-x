<p align="center">
  <img src="assets/logo.jpg" alt="RESQ-X" width="480">
</p>

<h3 align="center">An earthquake rescue robot</h3>

<p align="center">
  A small remote-controlled robot designed to help rescuers inspect dangerous areas after earthquakes.<br>
  Engineering project by <strong>Yusif Gurbanzade</strong> and <strong>Tahir</strong>, European Azerbaijan School.
</p>

---

> **Status:** educational prototype in development. The thermal sensor, the lifting mechanism and AI-assisted driving are **planned** and not yet confirmed working. Everything below describes the plan and expected outcomes, not tested results.

## Contents

- [Project idea](#project-idea)
- [The problem](#the-problem)
- [Aim and research question](#aim-and-research-question)
- [How RESQ-X will work](#how-resq-x-will-work)
- [Main components](#main-components)
- [Methodology and testing plan](#methodology-and-testing-plan)
- [Expected results](#expected-results)
- [Limitations and future improvements](#limitations-and-future-improvements)
- [Why this project is important](#why-this-project-is-important)
- [Conclusion](#conclusion)
- [Project website](#project-website)
- [References](#references)
- [License](#license)

## Project idea

RESQ-X is a remote-controlled robot designed to help rescuers inspect dangerous areas after earthquakes. It uses a camera to send live video to an operator, and we plan to add a thermal sensor to observe temperature differences in the areas it can see.

The robot is designed to move over small obstacles and uneven ground. We also plan to develop a servo-powered lifting arm or small scoop that could help move small rocks and lightweight debris.

## The problem

Earthquakes can cause buildings to collapse and leave people trapped under rubble. Searching these areas can be dangerous for rescue workers, because unstable walls and falling objects may cause injuries.

Technology could help rescuers inspect dangerous places before entering them themselves. A small robot with a camera and a simple lifting mechanism could help investigate an area and move some lightweight obstacles.

## Aim and research question

The aim of our project is to design and build a small robot that can be controlled remotely and provide useful information about its surroundings. We also want to explore how AI-assisted driving and a servo-powered lifting mechanism could make the robot more useful.

**Research question:** How can a low cost robot help rescuers inspect dangerous areas and move small obstacles after an earthquake?

## How RESQ-X will work

- A **Raspberry Pi 5** is the robot's main computer.
- A **Raspberry Pi camera** provides live video of the area in front of the robot.
- A **PlayStation 5 DualSense controller** lets the operator drive manually. We plan to explore AI-assisted driving, and manual driving stays available when AI mode is disabled.
- **Two geared motors** drive the wheels through a belt system. **Motor driver boards** let the robot move forward, backward and turn.
- An **MLX90640 thermal sensor** (planned) measures temperature patterns in its field of view. It may help the operator notice unusual warm areas, but it cannot see through solid concrete or rubble, and its readings cannot confirm that a person is trapped.
- A **servo motor** (planned) powers a lifting arm or small scoop for lifting or moving small rocks and lightweight debris. Its ability depends on the servo's strength and the mechanism's design, so it will be tested with lightweight objects first.
- An **MPU6050** sensor may measure the robot's tilt, and a **buzzer** gives a simple sound signal when needed.

## Main components

| Component | Role | Status |
| --- | --- | --- |
| Raspberry Pi 5 | Main computer | Core |
| Raspberry Pi Camera Module Rev 1.3 | Live video, and input for autonomous driving | Core |
| 2x JGA25-370 geared motors | Drive the robot | Core |
| L298N motor driver boards | Control the motors | Core |
| 4 crawler-style wheels, GT2 belts and pulleys | Movement over small obstacles and uneven ground | Core |
| PlayStation 5 DualSense controller | Manual remote control | Core |
| Buzzer | Sound signals | Core |
| Power banks and power connections | Power the system | Core |
| MLX90640 thermal sensor | Observe temperature patterns | Planned |
| Servo motor with lifting arm or scoop | Move small rocks and lightweight debris | Planned |
| AI-assisted driving software | Assisted driving, manual control stays available | Planned |
| MPU6050 sensor | Measure tilt | Optional |

## Methodology and testing plan

1. Assemble the robot's frame, wheels, motors and belt system.
2. Connect the motors to the motor driver boards and set up the power system.
3. Configure the Raspberry Pi and camera to provide live video to the operator.
4. Set up manual remote control using the PlayStation 5 controller.
5. Explore AI-assisted driving and test whether it can work safely alongside manual control.
6. Add the MLX90640 thermal sensor after purchasing it and test its readings.
7. Design and attach a servo-powered lifting arm or small scoop.
8. Test the lifting mechanism using small, lightweight objects to find out what it can safely move.
9. Create a safe obstacle course using lightweight materials.
10. Test the robot's movement, turning, remote control, camera, lifting mechanism and thermal readings.

We will record our observations and use them to identify problems and improve the design. Testing will take place in a controlled environment, not in a real earthquake or collapsed building.

## Expected results

We expect RESQ-X to become a working prototype that can move around a small obstacle course and send video to its operator. If the thermal sensor is successfully integrated, we expect it to display temperature patterns from the areas it can observe.

We also hope to develop AI-assisted driving and a servo-powered lifting arm or scoop that can move small rocks and lightweight debris. The lifting capacity will depend on the servo and the mechanism's design.

These are expected outcomes, and we will report the actual results after testing the prototype.

## Limitations and future improvements

RESQ-X will be a small educational prototype, not a professional rescue robot.

**Limitations**

- It may have difficulty moving over large rocks or heavy rubble.
- The servo-powered mechanism is intended for small obstacles and may not be strong enough to move heavy rocks or concrete.
- The thermal sensor has limited resolution and cannot see through solid objects. Its readings cannot prove that a trapped person is present.
- AI-assisted driving may make mistakes and will need careful testing.

**Future improvements**

- Better movement, battery life and lighting.
- An improved camera system and lifting mechanism.
- Software that can help identify people in camera images.

## Why this project is important

RESQ-X combines robotics, electronics, programming, AI and remote control to explore a real-world problem. It helps us learn how engineering can be used to develop tools that may support rescue teams.

By combining a camera, sensors and a small lifting mechanism, we want to explore how a robot could help inspect dangerous areas and move lightweight obstacles. Even if our prototype has limitations, testing it will help us understand what works, what needs improvement and how future versions could become more useful.

## Conclusion

RESQ-X is our attempt to design a small robot that could help rescuers inspect dangerous areas after earthquakes. By combining remote control, a camera, motors, a planned thermal sensor and a servo-powered lifting mechanism, we aim to develop a prototype that demonstrates how technology could support search operations. We also plan to explore AI-assisted driving while keeping manual control available.

Our next steps are to complete the construction, integrate the components and test the robot safely.

## Project website

This repository contains the project website: a single static page with no build step.

```
.
├── index.html          # the website (HTML, CSS and JS in one file)
├── 404.html            # not-found page for GitHub Pages
├── assets/
│   ├── js/motion.js        # GSAP animation layer
│   ├── js/pi-viewer.js     # 3D viewer (three.js, bundled, loads on demand)
│   ├── models/raspberry-pi-5.glb   # 3D Raspberry Pi 5 model
│   ├── pi5-poster.webp     # still image shown while the model loads
│   ├── vendor/             # GSAP 3.12.5 + ScrollTrigger (self-hosted)
│   ├── logo.jpg            # RESQ-X logo, cropped for the page
│   ├── logo-original.jpg   # logo as originally supplied
│   ├── favicon.svg
│   └── favicon.png
├── src/pi-viewer.js    # source of the 3D viewer
├── package.json        # only needed to rebuild the viewer bundle
├── robots.txt
├── .nojekyll           # tells GitHub Pages to serve files as-is
├── .gitignore
├── LICENSE
└── README.md
```

### Animations

Motion is built with [GSAP](https://gsap.com) and ScrollTrigger (files in `assets/vendor/`, no CDN needed), and is kept deliberately restrained:

- a single intro sequence: logo wipe, headline words rising out of a mask, and a scan line that reveals the simulated thermal grid
- a scroll progress line and a section indicator in the header
- section rules that draw in, headings that reveal word by word, and body text that comes up to full contrast as you read
- the signal-flow diagram draws itself, then small pulses travel along the core connections only (planned parts stay still)
- the testing plan highlights each step as you scroll

All of it is progressive enhancement. With `prefers-reduced-motion` enabled, or if the scripts fail to load, the page is fully visible and static. GSAP is used under the [GSAP Standard License](https://gsap.com/standard-license).

### 3D Raspberry Pi viewer

The "main computer" section shows an interactive 3D model of the Raspberry Pi 5:

- drag to rotate, double-click to reset, hold Ctrl or Cmd and scroll to zoom (plain scrolling still scrolls the page)
- arrow keys rotate and `+` / `-` zoom when the viewer is focused, so it works without a mouse
- markers name the main parts (processor, memory, GPIO header, camera connectors, ports and more); selecting one flies the camera to it, and markers hide when the part is out of sight
- view buttons: Top, Ports, Underside, Reset, plus auto-rotate and a markers toggle

The viewer and the 3.4 MB model only load when the section is about to scroll into view. If WebGL is unavailable, the page shows a still image instead.

The model was converted from the supplied STEP file to glTF (`.glb`) with realistic materials. The viewer bundle is built from `src/pi-viewer.js`; to change it:

```bash
npm install
npm run build:viewer
```

**Model credit:** add the author, source and license of the 3D model here before publishing: `TODO`.

### Run it locally

The 3D model has to be loaded over HTTP, so serve the folder rather than opening the file directly:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

### Deploy on GitHub Pages

1. Push this folder to a GitHub repository.
2. Go to **Settings > Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select your main branch and the `/ (root)` folder, then save.
4. After a minute the site is live at `https://<your-username>.github.io/<repository-name>/`.

To use a custom domain later, add a `CNAME` file with your domain name in the repository root and set the domain in the same Pages settings.

## References

- [Raspberry Pi 5](https://www.raspberrypi.com/products/raspberry-pi-5/)
- [Raspberry Pi camera documentation](https://www.raspberrypi.com/documentation/accessories/camera.html)
- [L298 motor driver information](https://www.st.com/en/motor-drivers/l298.html)
- [MLX90640 thermal sensor information](https://www.melexis.com/en/documents/documentation/datasheets/datasheet-mlx90640)
- [Yusif's GitHub profile](https://github.com/Gityus13)

## License

Released under the [MIT License](LICENSE).
