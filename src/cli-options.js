/**
 * Created by ikonovalov on 19/05/17.
 */

module.exports = {
    definitions: [
        {
            name: 'tag',
            type: String,
            alias: 't',
            typeLabel: '[underline]{path}',
            description: 'Path to a tag file.'
        },
        {
            name: 'public',
            type: String,
            alias: 'p',
            typeLabel: '[underline]{path}',
            description: 'Provided public key.'.red
        },
        {
            name: 'file',
            type: String,
            alias: 'f',
            typeLabel: '[underline]{path}',
            description: 'Signed file'
        },
        {
            name: 'output',
            type: String,
            alias: 'o',
            defaultValue: '/tmp/decrypted.file',
            typeLabel: '[underline]{path}',
            description: 'Signed file'
        },
        {
            name: 'version',
            alias: 'v',
            type: Boolean,
            description: 'Truth scanner version.'
        },
        {
            name: 'help',
            alias: 'h',
            type: Boolean,
            description: 'Here it is.'
        }
    ],

    checkMandatoryOptions: (options) => {
        let tagPath = options.tag;
        let encryptedFilePath = options.file;
        let publicKeyPath = options.public;
        if (!tagPath) {
            console.error('--tag option not provided.'); process.exit(1);
        }
        if (!encryptedFilePath) {
            console.error('--file option not provided.'); process.exit(1);
        }
        if (!publicKeyPath) {
            console.error('--public option not provided.'); process.exit(1);
        }
    }
}
;