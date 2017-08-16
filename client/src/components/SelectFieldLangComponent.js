import React, { Component } from "react";
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

class SelectFieldLanguage extends Component {

    menuItems(languages, values) {
        return languages.map((item, i) => {
            return <MenuItem key={i} checked={values && values.indexOf(item.name) !== -1} value={item.name} primaryText={item.name} />
        })
    }

    handleChangeLang = (event, index, values) => {
        console.log(values);
        const languages = this._getLangByName(values);
        console.log(languages);
        this.props.onChange(languages);
    }

    _getLangByName(langNames) {
        const languages = this.props.languages;
        let results = [];
        langNames.forEach(langName => {
            for (let lang of languages) {
                if (langName === lang.name) {
                    results.push(lang);
                    break;
                }
            }
        })
        console.log(langNames);
        console.log(results);
        return results;
    }

    selectionRenderer = (values) => {
        // console.log(values);
        return values.join(', ');
    }

    render() {
        const { languages, value } = this.props;
        // console.log(this.props);
        return (
            <SelectField id='language'
                value={value}
                multiple={true}
                onChange={this.handleChangeLang}
                floatingLabelText="Language"
                style={{ marginRight: '20px' }}
                selectionRenderer={this.selectionRenderer}
                >
                {this.menuItems(languages, value)}
            </SelectField>
        );
    }
}

export default SelectFieldLanguage;
