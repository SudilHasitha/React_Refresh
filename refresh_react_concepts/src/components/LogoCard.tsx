import React from 'react'
import { Company } from '../types'

interface LogoCardProps {
  companyLogo: Company
}

const LogoCard: React.FC<LogoCardProps> = ({ companyLogo }) => {
  const { name, logo_url } = companyLogo

  return (
    <div className="logo-card">
      <img
        src={logo_url || '/no-logo.png'}
        alt={name}
      />

      <div className="mt-4">
        <h3>{name}</h3>
      </div>

      <div className="rating">
          <img src="star.svg" alt="Star Icon" />
          {/* <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p> */}
      </div>
    </div>
  )
}

export default LogoCard