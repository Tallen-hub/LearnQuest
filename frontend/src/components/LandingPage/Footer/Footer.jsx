'use client'

const Footer = () => {
  return (
    <div style={{ backgroundColor: '#f7fafc', color: '#4a5568', padding: '0rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <div style={{ flex: '1 1 200px', margin: '1rem' }}>
          <h3>Company</h3>
          <a href={'#'}>About Us</a><br />
          <a href={'#'}>Blog</a><br />
          <a href={'#'}>Careers</a><br />
          <a href={'#'}>Contact Us</a>
        </div>

        <div style={{ flex: '1 1 200px', margin: '1rem' }}>
          <h3>Support</h3>
          <a href={'#'}>Help Center</a><br />
          <a href={'#'}>Safety Center</a><br />
          <a href={'#'}>Community Guidelines</a>
        </div>

        <div style={{ flex: '1 1 200px', margin: '1rem' }}>
          <h3>Legal</h3>
          <a href={'#'}>Cookies Policy</a><br />
          <a href={'#'}>Privacy Policy</a><br />
          <a href={'#'}>Terms of Service</a><br />
          <a href={'#'}>Law Enforcement</a>
        </div>

        <div style={{ flex: '1 1 200px', margin: '1rem' }}>
          <h3>Install App</h3>
          
        </div>
      </div>

      <div style={{ borderTop: '1px solid #e2e8f0', padding: '1rem 0', textAlign: 'center' }}>
        <p>©  All rights reserved</p>
        <div>
    
          <a href={'#'} style={{ margin: '0 1rem' }}>Twitter</a>
          <a href={'#'} style={{ margin: '0 1rem' }}>YouTube</a>
          <a href={'#'} style={{ margin: '0 1rem' }}>Instagram</a>
        </div>
      </div>
    </div>
  )
}

export default Footer

