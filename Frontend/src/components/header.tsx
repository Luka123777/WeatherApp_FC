import WeatherIcon from '../assets/images/logo.svg';
import IconUnits from '../assets/images/icon-units.svg';
import IconDropDown from '../assets/images/icon-dropdown.svg';
import '../styles/header.scss';
import { useHeaderDropdown } from '../animations/Animations';
import IconSelected from '../assets/images/icon-checkmark.svg';

import { useRef } from 'react';

export function Header() {
    // Ref para el dropdown
    const dropDownRef = useRef<HTMLDivElement >(null);
    const timelineDropDown = useHeaderDropdown(dropDownRef);

    const handleDropDown = () => {
        const tl = timelineDropDown.current;
        if (!tl) return;

        // Si está en estado reversed (cerrado), avanza (abre). Si no, retrocede (cierra).
        if (tl.reversed()) {
            tl.play();
        } else {
            tl.reverse();
        }
    };

  return (
    <header className='header'>
        <img src={WeatherIcon} />
        <div className='DropDownWrapper'>
            <button onClick={()=>{handleDropDown()}} className='unitsButton'>
                <img src={IconUnits}/>
                <p>Units</p>
                <img src={IconDropDown}/>
            </button>
            <div className='unitsButton-Dropdown' ref={dropDownRef}>
                <ul className='DropdownMenu'>
                    <h4>Switch to Imperial</h4>
                    <li className='temperature'>
                        <p>Temperature</p>
                        <ul className='temperatureOptions'>
                            <div className='groupCelcius'>
                                <li>Celcius (°C)</li>
                                <img src={IconSelected} alt="" />
                            </div>
                            <div className='groupFahrenheit'>
                                <li>Fahrenheit (°F)</li>
                                <img src={IconSelected} alt="" />
                            </div>
                        </ul>
                    </li>
                    <li className='windSpeed'>
                        <p>Wind Speed</p>
                        <ul className='windSpeedOptions'>
                            <div className='group-kmh'>
                                <li>km/h</li>
                                <img src={IconSelected} alt="" />
                            </div>
                            <div className='group-mph'>
                                <li>mph</li>
                                <img src={IconSelected} alt="" />
                            </div>
                        </ul>
                    </li>
                    <li className='precipitation'>
                        <p>Precipitation</p>
                        <ul className='precipitationOptions'>
                            <div className='groupMilimeters'>
                                <li>Milimeters (mm)</li>
                                <img src={IconSelected} alt="" />
                            </div>
                            <div className='groupInches'>
                                <li>Inches (in)</li>
                                <img src={IconSelected} alt="" />
                            </div>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </header>
  )
}