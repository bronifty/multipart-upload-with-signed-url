# CDK Example from AWS SDK V3 project which copies SST Notes App

`"pnpm cdk deploy" calls the "cdk" script in the root package.json, which runs a set of operations for the command line (it explodes or expands the operation set); that set of commands is change directory and run a script in the package.json of the subdirectory; that script is "cdk"; lastly the "deploy" part of the original command is appended to the "cdk" script in the subdirectory's package.json, in full the command expands or explodes to become the full command line script: "cd packages/infra && tsc && cdk deploy"`
