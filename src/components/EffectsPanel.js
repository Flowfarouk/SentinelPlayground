import React from 'react'
import Toggle from 'react-toggle'
import Store from '../store'
import {connect} from 'react-redux'
import 'react-toggle/style.css'
import RCSlider from 'rc-slider'

class EffectsPanel extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            gain: this.logToLinear(Store.current.gain,0.01,100),
            gainLbl: Store.current.gain,
            gamma: this.logToLinear(Store.current.gamma, 0.1, 10),
            gammaLbl: Store.current.gamma,
        }
    }

    logToLinear = (e, min, max) => {
        return (Math.log(e) - Math.log(min)) / (Math.log(max) - Math.log(min)) * max
    }

    updateAtmFilter = (e) => {
        Store.setAtmFilter(e.target.checked ? 'ATMCOR' : '')
    }

    updateCloudCor = (e) => {
        Store.setCloudCorrection(e.target.checked ? 'replace' : 'none')
    }

    updateGain = (e) => {
        Store.setGain(this.state.gainLbl)
    }

    updateGamma = (e) => {
        Store.setGamma(this.state.gammaLbl)
    }

    calcLog = (e, min, max) => {
        const pos = e/max
        const value = min * Math.exp(pos * Math.log(max / min))
        return value.toFixed(1)
    }

    changeGamma = (e) => {
        this.setState( {
            gamma: e,
            gammaLbl: this.calcLog(e, 0.1, 10)
        })
    }

    changeGain = (e) => {
        this.setState( {
            gain: e,
            gainLbl: this.calcLog(e, 0.01, 100)
        })
    }

    showDates = (e) => {
        Store.setShowDates(e.target.checked)
    }

    render() {
        const {atmFilter, preset, showDates, activeDatasource: {noEffects}} = Store.current
        let isEvalScriptFromLayers = preset === 'CUSTOM'
        return (
            <div className="effectsPanel">
                {!noEffects && <label>
                    <Toggle
                        checked={atmFilter !== ''}
                        onChange={this.updateAtmFilter}/>
                    <span>Atmospheric correction</span>
                </label>}
                <div />
                {/*<label>
                    <Toggle
                        checked={Store.current.cloudCorrection !== 'none'}
                        onChange={this.updateCloudCor}/>
                    <span>Cloud correction</span>
                </label>*/}
                <div />
                 <label title={preset === 'CUSTOM' ? 'Dates layer is available only for simple products.' : 'Render dates above Sentinel-2 imagery.'}>
                    <Toggle
                        disabled={!isEvalScriptFromLayers && preset === 'CUSTOM'}
                        checked={showDates}
                        onChange={this.showDates} />
                    <span>Show acquisition dates</span>
                </label>
                 <div />
                <label>
                    <span>Gain</span>
                    <div className="gainSlider">
                        <RCSlider min={0.01} max={100} step={0.1} value={this.state.gain} onChange={this.changeGain}
                              onAfterChange={this.updateGain} />
                        <span>{this.state.gainLbl}</span>
                    </div>
                </label>
                <label>
                    <span>Gamma</span>
                    <div className="gainSlider">
                        <RCSlider min={0.1} max={10} step={0.1} value={this.state.gamma} onChange={this.changeGamma}
                              onAfterChange={this.updateGamma} />
                        <span>{this.state.gammaLbl}</span>
                    </div>
                </label>
            </div>
        )
    }
}
export default connect(store => store)(EffectsPanel);