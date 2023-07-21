import '@/assets/css/app.scss'
import Image from 'next/image';
import Loading from './loading';

const languages = [{ id: 1, name: "English" }, { id: 2, name: "Danish" }];

export const metadata = {
  title: 'Reporting portal - Eventbuizz',
  description: 'Reporting portal - Eventbuizz',
}

export default function RootLayout({ children}: { children: React.ReactNode }) {
  return (
   
<div className="signup-wrapper">
      <main className="main-section" role="main">
        <div className="container">
          <div className="wrapper-box">
            <div className="container-box">
              <div className="row">
                <div className="col-6">
                  <div className="left-signup">
                    <Image src={'/img/logo.svg'} alt="" width="150" height="32" className='logos' />
                    <div className="text-block">
                      <h4>Welcome to Reporting Portal</h4>
                      <p>Streamline your reporting process with ease and efficiency</p>
                      <ul>
                        <li>Customization following easy steps</li>
                        <li>Sales forecasting and analytics</li>
                        <li>User management features, including access controls and user authentication.</li>
                        <li>Feel safe with our step by step navigation</li>
                      </ul>
                    </div>
                    <Image src={'/img/illustration.png'} alt="" width="300" height="220" className='illustration' />
                  </div>
                </div>
                <div className="col-6">
                  <div className="right-section-blank">
                    <ul className="main-navigation">
                      <li>
                          <a href="#!">
                            <i className="icons"><Image src={'/img/ico-globe.svg'} alt="" width="16" height="16" /></i>
                            <span id="language-switch">English</span><i className="material-icons">keyboard_arrow_down</i>
                          </a>
                          <ul>
                              {languages.map((value, key) => {
                                  return (
                                      <li key={key}>
                                          <a>{value.name}</a>
                                      </li>
                                  );
                              })}
                          </ul>
                      </li>
                    </ul>
                    <div className="right-formarea">
                        {children}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
