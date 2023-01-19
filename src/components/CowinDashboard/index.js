import {Component} from 'react'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './index.css'
import VaccinationCoverage from '../VaccinationCoverage'

class CowinDashboard extends Component {
  state = {isLoading: true, vaccinationData: {}}

  componentDidMount() {
    this.getVaccinationList()
  }

  getVaccinationList = async () => {
    const response = await fetch('https://apis.ccbp.in/covid-vaccination-data')
    if (response.ok === true) {
      const data = await response.json()
      const formattedData = {
        last7DaysVaccination: data.last_7_days_vaccination,
        vaccinationByAge: data.vaccinationByAge,
        vaccinationByGender: data.vaccinationByGender,
      }
      this.setState({isLoading: false, vaccinationData: formattedData})
    } else {
      this.setState({isLoading: false, vaccinationData: {}})
    }
  }

  renderVaccinationDetails = () => {
    const {vaccinationData} = this.state
    if (vaccinationData.length !== 0) {
      const {last7DaysVaccination} = vaccinationData
      return <VaccinationCoverage coverageDetails={last7DaysVaccination} />
    }
    return (
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png "
        alt="failure view"
        className="img-fail"
      />
    )
  }

  render() {
    const {isLoading} = this.state
    return (
      <div className="bg-container">
        <div className="vaccination-card-container">
          <div className="logo-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
              alt="website logo"
            />
            <h1>co-WIN</h1>
          </div>
          <p className="caption">co-WIN Vaccination in India</p>
          {isLoading ? (
            <div data-testid="loader" className="loader-card">
              <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
            </div>
          ) : (
            this.renderVaccinationDetails()
          )}
        </div>
      </div>
    )
  }
}

export default CowinDashboard
