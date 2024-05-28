import React, { Component } from "react";
import Particles from "react-tsparticles";

export default class ParticleSettings extends Component {
    render() {
        return (
            <div>
                <Particles
                    height="1000px" width="100vw"
                    id='tsparticles'
                    options={{
                        background: {
                            color: {
                                value: "#0d47a1"
                            }
                        },
                        fpsLimit:60,
                        interactivity:{
                            detect_on:'canvas',
                            events:{
                                onClick:{
                                    enable:'true',
                                    mode: 'push'
                                }
                            }
                        }
                    }}
                />
            </div>
        )
    }
}