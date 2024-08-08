import '@testing-library/cypress/add-commands';
const user_name : string = "kbot";
let cluster_name: string = Cypress.env('CLUSTER_NAME');
let totalDuration = Cypress.env('TIMEOUT'); 
let password: string ='',domain: string ='';

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

  it('Get Kbot password', () =>{
      const requestUrl: string = `https://kubefirst-development.mgmt-20.kubefirst.com/api/proxy?url=/cluster/${cluster_name}`;
      if(!checkStatusCode(requestUrl))  throw new Error(`Timed out after ${totalDuration / 60000} minutes waiting for status code 200 for ${url}.`);
      cy.request({
        method: 'GET',
        url: requestUrl,
        followRedirect: true,
      }).then((response)=>{
          const cluster = response.body;
          expect(cluster).to.have.property('vault_auth');
          expect(cluster.vault_auth).to.have.property('kbot_password');
          expect(cluster).to.have.property('domain_name');
          password = cluster.vault_auth.kbot_password;
          domain = cluster.domain_name;
      })
  })

  it('Login in through vault', () => {
      const baseUrl =  `https://kubefirst.${domain}/dashboard/applications`;
      cy.log(user_name,password,domain);
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

