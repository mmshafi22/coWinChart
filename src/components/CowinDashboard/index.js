import {Component} from 'react'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './index.css'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

const apiStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN PROGRESS',
}

class CowinDashboard extends Component {
  state = {loadingStatus: apiStatus.initial, vaccinationData: {}}

  componentDidMount() {
    this.getVaccinationList()
  }

  getVaccinationList = async () => {
    this.setState({loadingStatus: apiStatus.inProgress})
    const response = await fetch('https://apis.ccbp.in/covid-vaccination-data')
    if (response.ok === true) {
      const data = await response.json()
      const formattedData = {
        last7DaysVaccination: data.last_7_days_vaccination,
        vaccinationByAge: data.vaccination_by_age,
        vaccinationByGender: data.vaccination_by_gender,
      }
      this.setState({
        loadingStatus: apiStatus.success,
        vaccinationData: formattedData,
      })
    } else {
      this.setState({loadingStatus: apiStatus.failure})
    }
  }

  renderLoaderPage = () => (
    <div data-testid="loader" className="loader-card">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderFailurePage = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png "
        alt="failure view"
      />
      <h1>Something Went Wrong</h1>
    </div>
  )

  renderTheChartPage = () => {
    const {vaccinationData} = this.state
    const {
      last7DaysVaccination,
      vaccinationByAge,
      vaccinationByGender,
    } = vaccinationData

    return (
      <>
        <VaccinationCoverage coverageDetails={last7DaysVaccination} />
        <VaccinationByGender genderDetails={vaccinationByGender} />
        <VaccinationByAge ageDetails={vaccinationByAge} />
      </>
    )
  }

  renderAllThePages = () => {
    const {loadingStatus} = this.state
    switch (loadingStatus) {
      case apiStatus.success:
        return this.renderTheChartPage()
      case apiStatus.inProgress:
        return this.renderLoaderPage()
      case apiStatus.failure:
        return this.renderFailurePage()
      default:
        return null
    }
  }

  render() {
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
          <h1 className="caption">CoWIN Vaccination in India</h1>
          {this.renderAllThePages()}
        </div>
      </div>
    )
  }
}

export default CowinDashboard
