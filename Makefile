# Makefile
all: engine-start engine-dev engine-install api-get-all api-get-one api-add-one api-delete-one api-delete-all function-get-all function-get-one function-deploy function-update function-invoke function-delete-one function-delete-all clean check-variables cdk-bootstrap

# desktop-admin
executable:
	chmod -R +x .

clean:
	pnpm i && pnpx tsx clean.ts

check-variables:
	./scripts/admin-desktop/check-variables.sh

# admin-cloud
login:
	./scripts/admin-cloud/login.sh

bootstrap:
	./scripts/admin-cloud/bootstrap.sh


app-dev:
	./scripts/app-dev.sh

app-test:
	./scripts/app-test.sh

app-install: 
	./scripts/app-install.sh

# functions 
# call with function=<function-name>
# eg make function-deploy function=my-function
# a call with no args will have default args applied from the variables file
function-get-all:
	./scripts/function/function-get-all.sh

function-get-one:
	./scripts/function/function-get-one.sh $(function) 

function-deploy:
	./scripts/function/function-deploy.sh $(function)

function-update:
	./scripts/function/function-update.sh $(function)

function-invoke:
	./scripts/function/function-invoke.sh $(function)

function-delete-one:
	./scripts/function/function-delete-one.sh $(function)

function-delete-all:
	./scripts/function/function-delete-all.sh

# apis 
# call with api=<api-name> function=<function-name>
# eg make api-add-one api=my-api function=my-function
api-get-all:
	./scripts/api/api-get-all.sh

api-get-one:
	./scripts/api/api-get-one.sh $(api) 

api-add-one:
	./scripts/api/1-api-add-one.sh $(api) $(function)

api-delete-one:
	./scripts/api/api-delete-one.sh $(api)

api-delete-all:
	./scripts/api/api-delete-all.sh

api-create-integration:
	./scripts/api/2-api-create-integration.sh $(api) $(function)

api-get-all-integrations:
	./scripts/api/api-get-all-integrations.sh $(api)

api-grant-permissions:
	./scripts/api/3-api-grant-permissions.sh $(function) $(api)

api-cleanup:
	./scripts/api/4-api-cleanup.sh




# engine
engine-install:
	pnpm --prefix ./engine install

engine-dev:
	pnpm --prefix ./engine dev 

engine-start:
	pnpm --prefix ./engine start  

engine-clean:
	pnpm --prefix ./engine clean


# extras
api-create-default-route:
	./scripts/api/3-api-create-default-route.sh $(api) $(integration)


.PHONY: all engine-start engine-dev engine-install api-get-all api-get-one api-add-one api-delete-one api-delete-all function-get-all function-get-one function-deploy function-update function-invoke function-delete-one function-delete-all clean check-variables cdk-bootstrap

