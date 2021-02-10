describe('app_spec.ts', () => {
  it('should mount app after load', () => {
    cy.visit('/index.html');
    cy.get('#main').should('contain.html', 'nav');
  })
})