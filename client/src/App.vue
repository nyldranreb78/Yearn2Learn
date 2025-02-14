<template>
  <nav class="navbar navbar-expand-lg bg-white shadow">
    <div class="container-fluid">
			<div class="col-3"></div>

			<div class="col-6">
				<div class="navbar p-2">
					<div class="col">
						<strong>
							<a class = "navbar-brand fs-3" href="#">
								<img :src="require(`@/assets/img/Y2L_Logo.png`)" width="40" class="me-2" />
								<span class="txt-y2l-yellow">Yearn</span>
								<span class="txt-y2l-red">2</span>
								<span class="txt-y2l-blue">Learn</span>
							</a>
						</strong>
					</div>
				</div>
			</div>

			<div class="col-3 d-flex justify-content-end pe-2">
				<a
					tabindex="0"
					class="btn btn-warning"
					data-bs-toggle="modal"
					data-bs-target="#registerForm"
				>
					Log In
				</a>
			</div>
    </div>
  </nav>

  <div class="modal fade text-start" id="registerForm" tabindex="-1">
		<div class="modal-dialog modal-sm">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Log in</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
				</div>

				<div class="modal-body">
					<form>
						<div class="form-group">
							<label for="frmEmail">Email address</label>
							<input type="email" class="form-control" id="frmEEmail">
						</div>

						<div class="form-group">
							<label for="frmPassword" class="mt-2">Password</label>
							<input type="password" class="form-control" id="frmPassword" placeholder="Password">
						</div>
					</form>

					<div class="text-end">
						<small id="registerPrompt"><a href="#">Don't have an account?</a></small>
					</div>
				</div>
				
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
					<button type="button" class="btn btn-primary">Log in</button>
				</div>
			</div>
		</div>
	</div>

  <router-view />
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
