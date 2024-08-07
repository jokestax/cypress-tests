import '@testing-library/cypress/add-commands';
const user_name = Cypress.env('user_name');
const password = Cypress.env('password');
const domain = Cypress.env('domain_name');
const totalDuration = 120000;

const checkStatusCode = (url: string) => {

  cy.exec(`node checkStatus.js ${url} ${totalDuration}`,{timeout:totalDuration}).then(result=>{
    const response = JSON.parse(result.stdout);
    if(response.code ===0 && response.status === 200) return true;
    if(response.code===1) return false;
  })
  return true;
};

const checkRunning = (url:string) =>{
  cy.visit(url);
  cy.findByText(/running/i).should('exist');
}

describe('Kubefirst Console', () => {
  it('Login in through vault', () => {
      const baseUrl =  `https://kubefirst.${domain}/dashboard/applications`
      if(!checkStatusCode(baseUrl))  throw new Error(`Timed out after ${totalDuration / 60000} minutes waiting for status code 200 for ${url}.`);
      cy.visit(baseUrl)
      cy.findByRole('button', { name: /vault\-icon log in with vault/i}).click();
      cy.findByRole('combobox', {name: /method/i}).select('Username');
      cy.findByRole('textbox',{ name: /username/i}).clear().type(user_name);
      cy.get('input[name="password"]').type(password);
      cy.findByRole('button',{name: /sign in/i}).click();  
      cy.findByRole('tab', {
        name: /installed applications/i
      }).click();    
      cy.get(`a[href="https://metaphor-development.${domain}"]`).should('exist');
      cy.get(`a[href="https://metaphor-staging.${domain}"]`).should('exist');
      cy.get(`a[href="https://metaphor-production.${domain}"]`).should('exist');
  });

  it('Metaphor Development', () => {
    const url = `https://metaphor-development.${domain}`;
    if(!checkStatusCode(url))  throw new Error(`Timed out after ${totalDuration / 60000} minutes waiting for status code 200 for ${url}.`);
    else{
      checkRunning(url);
    }
  });

  it('Metaphor Staging', () => {
    const url = `https://metaphor-staging.${domain}`;
    if(!checkStatusCode(url))  throw new Error(`Timed out after ${totalDuration / 60000} minutes waiting for status code 200 for ${url}.`);
    else{
      checkRunning(url);
    }
  });

  it('Metaphor Production', () => {
    const url = `https://metaphor-production.${domain}`;
    if(!checkStatusCode(url))  throw new Error(`Timed out after ${totalDuration / 60000} minutes waiting for status code 200 for ${url}.`);
    else{
      checkRunning(url);
    }
  });


});

