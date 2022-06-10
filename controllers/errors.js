const getErrors = (req, res) => {
  // res.status(404).sendFile('./views/404.html')
  // res.status(404).sendFile(path.join(__dirname,'views','404.html'))//without ejs
  res.status(404).render("404", { docTitle: "Page not Found" ,
  isAuthenticated:req.isLoggedIn});
};
module.exports={getErrors}